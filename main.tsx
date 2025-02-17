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
    handler(request: Request): Promise<Response> {
      return withShopifyCart(request, async (cart: CartData) => {
        const data = await queryIndexPage();
        return renderHTML(
          <IndexPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            products={data.products}
          />,
        );
      });
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/products/:productId" }),
    handler(request: Request, params): Promise<Response> {
      return withShopifyCart(
        request,
        async (cart: CartData) => {
          const productId = params?.pathname.groups.productId;
          const data = await queryProductPage(productId!);
          return renderHTML(
            <ProductPage
              url={new URL(request.url)}
              cartSize={getSizeOf(cart)}
              cartId={cart.id}
              product={data.product}
            />,
          );
        },
      );
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/your-cart" }),
    handler(request: Request): Promise<Response> {
      return withShopifyCart(request, (cart: CartData) => {
        return renderHTML(
          <CartPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            cart={cart}
          />,
        );
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/add-to-cart" }),
    handler(request: Request): Promise<Response> {
      return withShopifyCart(request, async (cart: CartData) => {
        const formData = await request.formData();
        const productId = formData.get("productId")?.toString();
        await addToCart(cart.id, productId!);
        return renderHTML(
          <CartPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            cart={cart}
          />,
        );
      });
    },
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/remove" }),
    handler(request: Request): Promise<Response> {
      return withShopifyCart(request, async (cart: CartData) => {
        const formData = await request.formData();
        const itemId = formData.get("itemId")?.toString();
        await removeFromCart(cart.id, itemId!);
        return renderHTML(
          <CartPage
            url={new URL(request.url)}
            cartSize={getSizeOf(cart)}
            cart={cart}
          />,
        );
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

function renderHTML(
  // deno-lint-ignore no-explicit-any
  element: any,
) {
  return new Response(render(element), {
    headers: { "Content-Type": "text/html;charset=utf-8" },
  });
}

async function withShopifyCart(
  request: Request,
  handler: (cart: CartData) => Response | Promise<Response>,
) {
  const cookies = getCookies(request.headers);
  const cart = await fetchCart(cookies["cartId"] ?? null);
  const response = await handler(cart);
  setCookie(response.headers, { name: "cartId", value: cart.id });
  return response;
}

function getSizeOf(cart: CartData): number {
  return cart.lines.nodes.length;
}
