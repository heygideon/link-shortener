// Portions from https://github.com/dubinc/dub/blob/f216b94a24ca5a0a48c6543ee10392c9006c8b75/apps/web/app/api/links/metatags/utils.ts
// license: AGPLv3

import he from "he";
import { parse } from "node-html-parser";
import z from "zod";

function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 3000,
) {
  return new Promise<Response>((resolve, reject) => {
    const abortController = new AbortController();
    const timer = setTimeout(() => {
      abortController.abort();
      reject(new Error("Request timed out"));
    }, timeout);

    fetch(url, { ...options, signal: abortController.signal })
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
function responseToTextWithTimeout(
  response: Response,
  timeout = 2000,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Response reading timed out"));
    }, timeout);

    response
      .text()
      .then((text) => {
        clearTimeout(timer);
        resolve(text);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function getHtml(url: string) {
  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      // If we get a 406 or other error, check if it's a Cloudflare-protected site
      const isCloudflare = response.headers.get("server") === "cloudflare";
      if (isCloudflare) {
        console.warn(`Cloudflare-protected site detected: ${url}`);
        return null;
      }
      console.error(`HTTP error! status: ${response.status} for URL: ${url}`);
      return null;
    }

    // Skip parsing if the content is not text/html
    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("text/html")) {
      console.warn(`Skipping non-HTML for: ${url}`);
      return null;
    }

    try {
      const text = await responseToTextWithTimeout(response);

      // Check if the response contains Cloudflare's challenge page
      if (
        text.includes("challenge-platform") ||
        text.includes("cf-browser-verification")
      ) {
        console.warn(`Cloudflare challenge page detected for: ${url}`);
        return null;
      }

      return text;
    } catch (error) {
      console.error(`Error reading response text for ${url}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

export function getHeadChildNodes(html: string) {
  const ast = parse(html); // parse the html into AST format with node-html-parser
  const metaTags = ast.querySelectorAll("meta").map(({ attributes }) => {
    const property = attributes.property || attributes.name || attributes.href;
    return {
      property,
      content: attributes.content,
    };
  });
  const title = ast.querySelector("title")?.innerText;
  const linkTags = ast.querySelectorAll("link").map(({ attributes }) => {
    const { rel, href } = attributes;
    return {
      rel,
      href,
    };
  });

  return { metaTags, title, linkTags };
}

export function getRelativeUrl(url: string, imageUrl: string) {
  if (!imageUrl) {
    return null;
  }
  let resolved: string;
  try {
    if (z.httpUrl().safeParse(imageUrl).success) {
      resolved = new URL(imageUrl).toString();
    } else {
      const { protocol, host } = new URL(url);
      const baseURL = `${protocol}//${host}`;
      return new URL(imageUrl, baseURL).toString();
    }
  } catch {
    return null;
  }

  const linkPreviewImageBase64PrefixRegex =
    /^data:image\/(png|jpg|jpeg|gif|webp|avif);base64/i;
  if (linkPreviewImageBase64PrefixRegex.test(resolved)) {
    return resolved;
  }
  if (z.httpUrl().safeParse(resolved).success) {
    return resolved;
  }
  return null;
}

const generateFallbackMetadata = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const path = parsedUrl.pathname;

    // Clean up the path for title
    const pathParts = path.split("/").filter(Boolean);
    const lastPathPart = pathParts[pathParts.length - 1] || "";

    let formattedPath = lastPathPart;
    try {
      formattedPath = decodeURIComponent(lastPathPart);
    } catch (_e) {}

    return {
      title: formattedPath || hostname.replace(/^www\./, ""),
      description: `Visit ${hostname}${path}`,
      image: null,
      icon: null,
    };
  } catch (_e) {
    return {
      title: url,
      description: "No description available",
      image: null,
      icon: null,
    };
  }
};

export const getMetaTags = async (url: string) => {
  const html = await getHtml(url);
  if (!html) {
    // If we couldn't fetch the HTML (e.g., due to Cloudflare protection),
    // generate fallback metadata from the URL
    return generateFallbackMetadata(url);
  }

  const { metaTags, title: titleTag, linkTags } = getHeadChildNodes(html);

  const object: Record<string, string> = {};

  for (const k in metaTags) {
    const { property, content } = metaTags[k];

    // !object[property] → (meaning we're taking the first instance of a metatag and ignoring the rest)
    if (property && content && !object[property]) {
      object[property] = content && he.decode(content);
    }
  }

  for (const m in linkTags) {
    const { rel, href } = linkTags[m];

    // !object[rel] → (ditto the above)
    if (rel && href && !object[rel]) {
      object[rel] = href;
    }
  }

  const title = object["og:title"] || object["twitter:title"] || titleTag;

  const description =
    object["description"] ||
    object["og:description"] ||
    object["twitter:description"];

  const image =
    object["og:image"] || object["twitter:image"] || object["image_src"];

  const icon = object["icon"] || object["shortcut icon"];

  return {
    title: title || url,
    description: description || "No description",
    image: getRelativeUrl(url, image),
    icon: getRelativeUrl(url, icon),
  };
};
export type MetaTags = Awaited<ReturnType<typeof getMetaTags>>;
