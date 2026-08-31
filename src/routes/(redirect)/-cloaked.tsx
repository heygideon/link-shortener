import type { MetaTags } from "./-meta";

export function CloakedTemplate({
  url,
  metaTags,
}: {
  url: string;
  metaTags: MetaTags;
}) {
  const { title, description, image, icon } = metaTags;
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {image && <meta property="og:image" content={image} />}
        {icon && <link rel="icon" href={icon} />}
        {/* <link rel="icon" href={image || "https://www.google.com/s2/favicons?sz=64&domain_url=" + new URL(url).hostname} /> */}

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <iframe
          src={url}
          title={title}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        ></iframe>
      </body>
    </html>
  );
}
