import Helmet from "preact-helmet";

export interface HeadProps {
  url: URL;
  title: string;
  description: string;
  image?: string;
}

export function Head({ description, image, title, url }: HeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="icon" href="https://fartlabs.org/fl-logo.png" />
      <meta name="description" content={description} />
      <link rel="stylesheet" href="/app.css" />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url.href} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={url.hostname} />
      <meta property="twitter:url" content={url.href} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />

      {/* Google Analytics */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-RZZ3R5K60G"
      >
      </script>
      <script
        dangerouslySetInnerHTML={{
          "__html": `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-RZZ3R5K60G');`,
        }}
      >
      </script>

      {/* Dialog Polyfill */}
      <script
        type="module"
        src="https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.esm.js"
      >
      </script>
      <script
        nomodule
        src="https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.js"
      >
      </script>
    </Helmet>
  );
}
