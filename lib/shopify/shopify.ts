import type { Image, Money } from "./types.ts";

const shopifyShop = Deno.env.get("SHOPIFY_SHOP");
const shopifyAccessToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
const apiVersion = "2025-01";

if (shopifyShop === undefined || shopifyAccessToken === undefined) {
  throw new Error("env `SHOPIFY_SHOP` and `SHOPIFY_ACCESS_TOKEN` must be set");
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(
    `https://${shopifyShop}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": shopifyAccessToken!,
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

export async function fetchCart(id: string | null): Promise<CartData> {
  if (id === null) {
    return await createCart();
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

    // TODO: Reset cart ID cookie.
    return fetchCart(null);
  }

  return cart;
}

export async function createCart(): Promise<CartData> {
  const { cartCreate } = await graphql<{
    cartCreate: { cart: CartData };
  }>(`mutation { cartCreate { cart ${CART_QUERY} } }`);
  return cartCreate.cart;
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
