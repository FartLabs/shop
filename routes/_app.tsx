import { type PageProps } from "$fresh/server.ts";
import { IS_BROWSER } from "@fresh/core/runtime";
import { SWRProvider } from "./swr-provider.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FartLabs Shop</title>

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
      </head>
      <body>
        {IS_BROWSER
          ? (
            <SWRProvider>
              <Component />
            </SWRProvider>
          )
          : <Component />}
      </body>
    </html>
  );
}
