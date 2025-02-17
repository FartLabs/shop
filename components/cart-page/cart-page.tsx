import type { CartData } from "@/lib/shopify/mod.ts";
import { formatCurrency } from "@/lib/shopify/mod.ts";
import { Layout } from "@/components/layout/layout.tsx";

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
                There are no items in the cart. <a href="/">Go shopping</a>{" "}
                to fill it up.
              </p>
            )
            : (
              <ul role="list">
                {props.cart.lines.nodes.map((line) => (
                  <li key={line.id}>
                    {/* TODO: Share product preview component with index page. */}
                    <div>
                      <img
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText ??
                          line.merchandise.product.title}
                        width="400"
                        height="400"
                        style={{ borderRadius: "0.5rem" }}
                      />
                    </div>
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

                        <div>
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
                        </div>
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
          <div>
            <h2>Subtotal</h2>
            <p>{formatCurrency(props.cart.estimatedCost.totalAmount)}</p>
          </div>
          <p>Shipping and taxes calculated at checkout.</p>
          <div>
            {props.cart.lines.nodes.length === 0
              ? (
                <span class="fart-button fart-button--disabled">
                  Checkout
                </span>
              )
              : (
                <a
                  href={props.cart.checkoutUrl}
                  class="fart-button"
                >
                  Checkout
                </a>
              )}
          </div>
          <div>
            <p>
              or&nbsp;
              <a href="/" class="fart-button">
                Continue Shopping <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
