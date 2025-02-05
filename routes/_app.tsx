import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/app.css" />

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
      </Head>
      <Component />
    </>
  );
}
