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
