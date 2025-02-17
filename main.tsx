import type { Route } from "@std/http/unstable-route";
import { getCookies, setCookie } from "@std/http/cookie";
import { serveDir } from "@std/http/file-server";
import { route } from "@std/http/unstable-route";
import { render } from "preact-render-to-string";
import { addToCart, fetchCart } from "@/lib/shopify/mod.ts";
import {
  IndexPage,
  queryIndexPage,
} from "@/components/index-page/index-page.tsx";
import {
  ProductPage,
  queryProductPage,
} from "@/components/product-page/product-page.tsx";
import { CartPage } from "@/components/cart-page/cart-page.tsx";

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
      const cookies = getCookies(request.headers);
      const cart = await fetchCart(cookies["cartId"] ?? null);
      const productId = params?.pathname.groups.productId;
      const data = await queryProductPage(productId!);
      const headers = new Headers({
        "Content-Type": "text/html;charset=utf-8",
      });
      setCookie(headers, { name: "cartId", value: cart.id });
      return new Response(
        render(
          <ProductPage
            url={new URL(request.url)}
            cartId={cart.id}
            product={data.product}
          />,
        ),
        { headers },
      );
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/cart" }),
    async handler(request: Request): Promise<Response> {
      const cookies = getCookies(request.headers);
      const cart = await fetchCart(cookies["cartId"] ?? null);
      const headers = new Headers({
        "Content-Type": "text/html;charset=utf-8",
      });
      setCookie(headers, { name: "cartId", value: cart.id });
      return new Response(
        render(
          <CartPage url={new URL(request.url)} cart={cart} />,
        ),
        { headers },
      );
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/add-to-cart" }),
    async handler(request: Request): Promise<Response> {
      const cookies = getCookies(request.headers);
      const cart = await fetchCart(cookies["cartId"] ?? null);
      const formData = await request.formData();
      const productId = formData.get("productId")?.toString();
      await addToCart(cart.id, productId!);
      const referer = request.headers.get("Referer");
      const headers = new Headers({ Location: referer ?? "/" });
      setCookie(headers, { name: "cartId", value: cart.id });
      return new Response("", { status: 302, headers });
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
