import type { CartData } from "@/lib/shopify/mod.ts";
import { formatCurrency } from "@/lib/shopify/mod.ts";
import { Layout } from "@/components/layout/layout.tsx";
import { ProductCardPicture } from "@/components/product-page/product-card.tsx";

export interface CartPageProps {
  url: URL;
  cartSize: number;
  cart?: CartData;
  error?: Error;
}

export function CartPage(props: CartPageProps) {
  return (
    <Layout
      url={props.url}
      cartSize={props.cartSize}
      title="Cart at FartLabs Shop"
      description="Your shopping cart at FartLabs Shop."
    >
      <section className="fart-section">
        {props.error !== undefined
          ? <div>Error: {props.error.message}</div>
          : <CartContent cart={props.cart} cartSize={props.cartSize} />}
      </section>
    </Layout>
  );
}

function CartContent(props: { cart: CartData | undefined; cartSize: number }) {
  return (
    <div>
      <div>
        <h1>Shopping Cart</h1>
      </div>
      {props.cart !== undefined && (
        <div>
          {props.cart.lines.nodes.length === 0
            ? (
              <p>
                There are no items in the cart.{" "}
                <a href="/" class="fart-button">Go shopping</a> to fill it up.
              </p>
            )
            : (
              <ul role="list">
                {props.cart.lines.nodes.map((line) => (
                  <li key={line.id}>
                    <ProductCardPicture
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText}
                    />
                    <div>
                      <div>
                        <div>
                          <h3>
                            <a
                              href={`/products/${line.merchandise.product.handle}`}
                            >
                              {line.merchandise.product.title}
                            </a>
                          </h3>
                          <p>
                            {formatCurrency(line.estimatedCost.totalAmount)}
                          </p>
                        </div>
                        <p>
                          {line.merchandise.title !==
                              line.merchandise.product.title
                            ? line.merchandise.title
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p>
                          Quantity <strong>{line.quantity}</strong>
                        </p>

                        <p>
                          <form method="POST" action="/remove">
                            <input
                              type="hidden"
                              name="itemId"
                              value={line.id}
                            />
                            <button type="submit" class="fart-button">
                              Remove
                            </button>
                          </form>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}

      {props.cart !== undefined && (
        <div>
          <h2>Subtotal</h2>
          <p>{formatCurrency(props.cart.estimatedCost.totalAmount)}</p>
          <p>Shipping and taxes calculated at checkout.</p>

          <p>
            {props.cart.lines.nodes.length === 0
              ? (
                <s class="fart-button" style={{ pointerEvents: "none" }}>
                  Checkout
                </s>
              )
              : (
                <a
                  href={props.cart.checkoutUrl}
                  class="fart-button"
                >
                  Checkout
                </a>
              )}
          </p>

          <p>
            or&nbsp;
            <a href="/" class="fart-button">
              Continue Shopping <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
