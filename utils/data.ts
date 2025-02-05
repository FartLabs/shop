import useSWR, { mutate } from "swr";
import { Image, Money } from "./types.ts";

export interface CartData {
  id: string;
  lines: {
    nodes: {
      id: string;
      quantity: number;
      merchandise: {
        product: {
          title: string;
        };
        title: string;
        image: Image;
      };
      estimatedCost: {
        totalAmount: Money;
      };
    }[];
  };
  checkoutUrl: string;
  estimatedCost: {
    totalAmount: Money;
  };
}

const CART_QUERY = `{
  id
  lines(first: 100) {
    nodes {
      id
      quantity
      merchandise {
        ...on ProductVariant {
          title
          image {
            url
            altText
          }
          product {
            title
          }
        }
      }
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
  checkoutUrl
  estimatedCost {
    totalAmount {
      amount
      currencyCode
    }
  }
}`;

// deno-lint-ignore no-explicit-any
async function shopifyGraphql<T = any>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch("/api/shopify", {
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
}

async function cartFetcher(): Promise<CartData> {
  const id = localStorage.getItem("cartId");
  if (id === null) {
    const { cartCreate } = await shopifyGraphql<
      { cartCreate: { cart: CartData } }
    >(`mutation { cartCreate { cart ${CART_QUERY} } }`);
    localStorage.setItem("cartId", cartCreate.cart.id);
    return cartCreate.cart;
  }

  const { cart } = await shopifyGraphql(
    `query($id: ID!) { cart(id: $id) ${CART_QUERY} }`,
    { id },
  );
  if (cart === null) {
    // If there is a cart ID, but the returned cart is null, then the cart
    // was already part of a completed order. Clear the cart ID and get a new
    // one.
    localStorage.removeItem("cartId");
    return cartFetcher();
  }

  return cart;
}

export function useCart() {
  // TODO: Fix.

  //   C:\Users\ethan\Documents\GitHub\shop>deno task start
  // Task start deno run -A --watch=static/,routes/ dev.ts
  // Watcher Process started.
  // The manifest has been generated for 5 routes and 3 islands.

  //  🍋 Fresh ready
  //     Local: http://localhost:8000/

  // Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
  // 1. You might have mismatching versions of React and the renderer (such as React DOM)
  // 2. You might be breaking the Rules of Hooks
  // 3. You might have more than one copy of React in the same app
  // See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
  // An error occurred during route handling or page rendering.

  //   1462 |           "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
  //   1463 |         );
  // > 1464 |       return dispatcher.useContext(Context);
  //        |                         ^
  //   1465 |     };
  //   1466 |     exports.useDebugValue = function (value, formatterFn) {
  //   1467 |       return resolveDispatcher().useDebugValue(value, formatterFn);

  // TypeError: Cannot read properties of null (reading 'useContext')
  //     at process.env.NODE_ENV.exports.useContext (file:///C:/Users/ethan/AppData/Local/deno/npm/registry.npmjs.org/react/19.0.0/cjs/react.development.js:1464:25)
  //     at useSWRConfig (file:///C:/Users/ethan/AppData/Local/deno/npm/registry.npmjs.org/swr/2.3.2/dist/_internal/index.mjs:33:40)
  //     at useSWRArgs (file:///C:/Users/ethan/AppData/Local/deno/npm/registry.npmjs.org/swr/2.3.2/dist/_internal/index.mjs:70:32)
  //     at useCart (file:///C:/Users/ethan/Documents/GitHub/shop/utils/data.ts:101:10)
  //     at Object.Cart (file:///C:/Users/ethan/Documents/GitHub/shop/islands/Cart.tsx:45:27)
  //     at m (https://esm.sh/*preact-render-to-string@6.3.1/denonext/preact-render-to-string.mjs:2:3237)
  //     at m (https://esm.sh/*preact-render-to-string@6.3.1/denonext/preact-render-to-string.mjs:2:2543)
  //     at m (https://esm.sh/*preact-render-to-string@6.3.1/denonext/preact-render-to-string.mjs:2:3802)
  //     at m (https://esm.sh/*preact-render-to-string@6.3.1/denonext/preact-render-to-string.mjs:2:2543)
  //     at m (https://esm.sh/*preact-render-to-string@6.3.1/denonext/preact-render-to-string.mjs:2:5050)
  // Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
  // 1. You might have mismatching versions of React and the renderer (such as React DOM)
  // 2. You might be breaking the Rules of Hooks
  // 3. You might have more than one copy of React in the same app
  // See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
  // An error occurred during route handling or page rendering.

  //   1462 |           "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
  //   1463 |         );
  // > 1464 |       return dispatcher.useContext(Context);
  //        |                         ^
  //   1465 |     };
  //   1466 |     exports.useDebugValue = function (value, formatterFn) {
  //   1467 |       return resolveDispatcher().useDebugValue(value, formatterFn);

  // TypeError: Cannot read properties of null (reading 'useContext')
  //     at process.env.NODE_ENV.exports.useContext (file:///C:/Users/ethan/AppData/Local/deno/npm/registry.npmjs.org/react/19.0.0/cjs/react.development.js:1464:25)
  //     at useSWRConfig (file:///C:/Users/ethan/AppData/Local/deno/npm/registry.npmjs.org/swr/2.3.2/dist/_internal/index.mjs:33:40)
  //     at useSWRArgs (file:///C:/Users/ethan/AppData/Local/deno/npm/registry.npmjs.org/swr/2.3.2/dist/_internal/index.mjs:70:32)
  //     at useCart (file:///C:/Users/ethan/Documents/GitHub/shop/utils/data.ts:101:10)
  //     at Object.Cart (file:///C:/Users/ethan/Documents/GitHub/shop/islands/Cart.tsx:45:27)
  return useSWR<CartData, Error>("cart", cartFetcher, {});
}

const ADD_TO_CART_QUERY =
  `mutation add($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart ${CART_QUERY}
  }
}`;

export async function addToCart(cartId: string, productId: string) {
  const mutation = shopifyGraphql<{ cart: CartData }>(ADD_TO_CART_QUERY, {
    cartId,
    lines: [{ merchandiseId: productId }],
  }).then(({ cart }) => cart);
  await mutate("cart", mutation);
}

const REMOVE_FROM_CART_MUTATION = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart ${CART_QUERY}
    }
  }
`;

export async function removeFromCart(cartId: string, lineItemId: string) {
  const mutation = shopifyGraphql<{ cart: CartData }>(
    REMOVE_FROM_CART_MUTATION,
    {
      cartId,
      lineIds: [lineItemId],
    },
  ).then(({ cart }) => cart);
  await mutate("cart", mutation);
}

export function formatCurrency(amount: Money) {
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.currencyCode,
  });
  return intl.format(amount.amount);
}
