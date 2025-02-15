import { serveDir } from "@std/http/file-server";
import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";
import { render } from "preact-render-to-string";
import {
  IndexPage,
  queryIndexPage,
} from "@/components/index-page/index-page.tsx";

const routes: Route[] = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    async handler(request: Request): Promise<Response> {
      const data = await queryIndexPage();
      return new Response(
        render(
          <IndexPage
            url={new URL(request.url)}
            products={data.products}
          />,
        ),
        { headers: { "Content-Type": "text/html;charset=utf-8" } },
      );
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/*" }),
    handler(request: Request): Promise<Response> {
      return serveDir(request, { fsRoot: "./static" });
    },
  },
];

function defaultHandler(_request: Request): Response {
  return new Response("Not found", { status: 404 });
}

export default {
  fetch: route(routes, defaultHandler),
} satisfies Deno.ServeDefaultExport;
