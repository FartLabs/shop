import type { Route } from "@std/http/unstable-route";
import { getCookies, setCookie } from "@std/http/cookie";
import { serveDir } from "@std/http/file-server";
import { route } from "@std/http/unstable-route";
import { render } from "preact-render-to-string";
import {
  addToCart,
  CartData,
  fetchCart,
  removeFromCart,
} from "@/lib/shopify/mod.ts";
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
      const cart = await fetchShopifyCartFromCookies(request);
      const data = await queryIndexPage();
      return makeShopifyCartResponse(
        render(
          <IndexPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            products={data.products}
          />,
        ),
        cart.id,
        { headers: { "Content-Type": "text/html;charset=utf-8" } },
      );
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/products/:productId" }),
    async handler(request: Request, params): Promise<Response> {
      const cart = await fetchShopifyCartFromCookies(request);
      const productId = params?.pathname.groups.productId;
      const data = await queryProductPage(productId!);
      return makeShopifyCartResponse(
        render(
          <ProductPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            cartId={cart.id}
            product={data.product}
          />,
        ),
        cart.id,
        { headers: { "Content-Type": "text/html;charset=utf-8" } },
      );
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/your-cart" }),
    async handler(request: Request): Promise<Response> {
      const cart = await fetchShopifyCartFromCookies(request);
      return makeShopifyCartResponse(
        render(
          <CartPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            cart={cart}
          />,
        ),
        cart.id,
        { headers: { "Content-Type": "text/html;charset=utf-8" } },
      );
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/add" }),
    async handler(request: Request): Promise<Response> {
      const cart = await fetchShopifyCartFromCookies(request);
      const formData = await request.formData();
      const productId = formData.get("productId")?.toString();
      await addToCart(cart.id, productId!);
      const referer = request.headers.get("Referer");
      return new Response("", {
        status: 302,
        headers: { "Location": referer ?? "/" },
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/remove" }),
    async handler(request: Request): Promise<Response> {
      const cart = await fetchShopifyCartFromCookies(request);
      const formData = await request.formData();
      const itemId = formData.get("itemId")?.toString();
      await removeFromCart(cart.id, itemId!);
      return new Response("", {
        status: 302,
        headers: { "Location": "/your-cart" },
      });
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

async function fetchShopifyCartFromCookies(
  request: Request,
): Promise<CartData> {
  const cookies = getCookies(request.headers);
  return await fetchCart(cookies["cartId"] ?? null);
}

/**
 * makeShopifyCartResponse creates a response with the cart ID as a cookie.
 */
function makeShopifyCartResponse(
  body: BodyInit,
  cartId: string,
  options?: RequestInit,
) {
  const headers = new Headers(options?.headers);
  setCookie(headers, { name: "cartId", value: cartId });
  return new Response(body, { ...options, headers });
}

function getSizeOf(cart: CartData): number {
  return cart.lines.nodes.reduce((total, line) => total + line.quantity, 0);
}
