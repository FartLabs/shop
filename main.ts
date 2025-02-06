import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";
import { serveDir } from "@std/http";

const routes: Route[] = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    handler(_request: Request): Response {
      return new Response("Hello world!");
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
