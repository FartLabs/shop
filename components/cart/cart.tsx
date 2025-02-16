import { useRef } from "preact/hooks";
import type { CartData } from "@/lib/shopify/mod.ts";
import { formatCurrency, removeFromCart } from "@/lib/shopify/mod.ts";
import { CartIcon } from "./cart-icon.tsx";

declare global {
  interface HTMLDialogElement {
    showModal(): void;
    close(): void;
  }
}

// TODO: Move to app.css.
// const slideRight = animation("0.4s ease normal", {
//   from: { transform: "translateX(100%)" },
//   to: { transform: "translateX(0)" },
// } as unknown as string);
// const slideBottom = animation("0.4s ease normal", {
//   from: { transform: "translateY(100%)" },
//   to: { transform: "translateY(0)" },
// } as unknown as string);

// const backdrop = css({
//   "&::backdrop": {
//     background: "rgba(0, 0, 0, 0.5)",
//   },
// });

export interface CartProps {
  cart?: CartData;
  error?: Error;
}

export function Cart(props: CartProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  const onDialogClick = (e: MouseEvent) => {
    if ((e.target as HTMLDialogElement).tagName === "DIALOG") {
      ref.current!.close();
    }
  };

  if (props.error !== undefined) {
    return <div>Error: {props.error.message}</div>;
  }

  return (
    <div>
      <button
        onClick={() => ref.current!.showModal()}
      >
        <CartIcon />
        {props.cart?.lines.nodes.length ?? "0"}
      </button>
      <dialog ref={ref} onClick={onDialogClick}>
        <CartInner cart={props.cart} />
      </dialog>
    </div>
  );
}

function CartInner(props: { cart: CartData | undefined }) {
  const handleCheckoutEvent = (e: Event) => {
    e.preventDefault();
    if (props.cart !== undefined) {
      location.href = props.cart.checkoutUrl;
    }
  };

  const removeByItemId = (itemId: string) => {
    if (props.cart !== undefined) {
      removeFromCart(props.cart.id, itemId);
    }
  };

  return (
    <div>
      <div>
        <h2>Shopping Cart</h2>
        <button
          class="py-1"
          onClick={(e) => {
            (e.target as HTMLButtonElement).closest("dialog")!.close();
          }}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      {props.cart !== undefined && (
        <div>
          {props.cart.lines.nodes.length === 0
            ? <p>There are no items in the cart.</p>
            : (
              <ul role="list">
                {props.cart.lines.nodes.map((line) => (
                  <li>
                    <div>
                      <img
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText ??
                          line.merchandise.product.title}
                      />
                    </div>
                    <div>
                      <div>
                        <div>
                          <h3>{line.merchandise.product.title}</h3>
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
                          <button
                            type="button"
                            onClick={() => removeByItemId(line.id)}
                          >
                            Remove
                          </button>
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
            <p>Subtotal</p>
            <p>{formatCurrency(props.cart.estimatedCost.totalAmount)}</p>
          </div>
          <p>
            Shipping and taxes calculated at checkout.
          </p>
          <div>
            <button
              type="button"
              disabled={props.cart.lines.nodes.length === 0}
              onClick={handleCheckoutEvent}
            >
              Checkout
            </button>
          </div>
          <div>
            <p>
              or&nbsp;
              <button
                type="button"
                onClick={(e) => {
                  (e.target as HTMLButtonElement).closest("dialog")!.close();
                }}
              >
                Continue Shopping <span aria-hidden="true">&rarr;</span>
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
