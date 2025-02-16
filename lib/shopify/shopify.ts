import type { Image, Money } from "./types.ts";

const SHOPIFY_SHOP = Deno.env.get("SHOPIFY_SHOP");
const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");

if (SHOPIFY_SHOP === undefined || SHOPIFY_ACCESS_TOKEN === undefined) {
  throw new Error("env `SHOPIFY_SHOP` and `SHOPIFY_ACCESS_TOKEN` must be set");
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(
    `https://${SHOPIFY_SHOP}/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(
      json.errors.map((error: Error) => error.message).join("\n"),
    );
  }

  return json.data as T;
}

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

// TODO: Migrate references of shopifyGraphql to client layer.
// // deno-lint-ignore no-explicit-any
// async function shopifyGraphql<T = any>(
//   query: string,
//   variables?: Record<string, unknown>
// ): Promise<T> {
//   const response = await fetch("/api/shopify", {
//     method: "POST",
//     body: JSON.stringify({ query, variables }),
//   });

//   return await response.json();
// }

export async function fetchCart(): Promise<CartData> {
  const id = localStorage.getItem("cartId");
  if (id === null) {
    const { cartCreate } = await graphql<{
      cartCreate: { cart: CartData };
    }>(`mutation { cartCreate { cart ${CART_QUERY} } }`);
    return cartCreate.cart;
  }

  const { cart } = await graphql<{ cart: CartData | null }>(
    `query($id: ID!) { cart(id: $id) ${CART_QUERY} }`,
    { id },
  );
  if (cart === null) {
    // If there is a cart ID, but the returned cart is null, then the cart
    // was already part of a completed order. Clear the cart ID and get a new
    // one.
    // localStorage.removeItem("cartId");

    // TODO: Delete cart ID from cookie.
    return fetchCart();
  }

  return cart;
}

const ADD_TO_CART_QUERY =
  `mutation add($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart ${CART_QUERY}
  }
}`;

export function addToCart(cartId: string, productId: string) {
  return graphql<{ cart: CartData }>(ADD_TO_CART_QUERY, {
    cartId,
    lines: [{ merchandiseId: productId }],
  }).then(({ cart }) => cart);
}

const REMOVE_FROM_CART_MUTATION =
  `mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart ${CART_QUERY}
  }
}`;

export function removeFromCart(cartId: string, lineItemId: string) {
  return graphql<{ cart: CartData }>(REMOVE_FROM_CART_MUTATION, {
    cartId,
    lineIds: [lineItemId],
  }).then(({ cart }) => cart);
}

export function formatCurrency(amount: Money) {
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.currencyCode,
  });
  return intl.format(amount.amount);
}
