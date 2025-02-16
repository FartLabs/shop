import { serveDir } from "@std/http/file-server";
import type { Route } from "@std/http/unstable-route";
import { route } from "@std/http/unstable-route";
import { render } from "preact-render-to-string";
import { fetchCart } from "@/lib/shopify/mod.ts";
import {
  IndexPage,
  queryIndexPage,
} from "@/components/index-page/index-page.tsx";
import {
  ProductPage,
  queryProductPage,
} from "@/components/product-page/product-page.tsx";

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
    pattern: new URLPattern({ pathname: "/products/:productId" }),
    async handler(request: Request, params): Promise<Response> {
      const productId = params?.pathname.groups.productId;
      const data = await queryProductPage(productId!);
      const cart = await fetchCart();
      return new Response(
        render(
          <ProductPage
            url={new URL(request.url)}
            cartId={cart.id}
            product={data.product}
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
