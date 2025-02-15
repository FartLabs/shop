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
        class="flex items-center gap-2 items-center border-2 border-yellow-800 rounded-full px-5 py-1 font-semibold text-yellow-800 hover:bg-yellow-800 hover:text-white transition-colors duration-300"
      >
        <CartIcon />
        {props.cart?.lines.nodes.length ?? "0"}
      </button>
      <dialog
        ref={ref}
        class={`bg-transparent p-0 m-0 pt-[50%] sm:pt-0 sm:ml-auto max-w-full sm:max-w-lg w-full max-h-full h-full${/* ${slideBottom} sm:${slideRight}*/ " "}`}
        onClick={onDialogClick}
      >
        <CartInner cart={props.cart} />
      </dialog>
    </div>
  );
}

function CartInner(props: { cart: CartData | undefined }) {
  const corners = "rounded(tl-2xl tr-2xl sm:(tr-none bl-2xl))";
  const card =
    `py-8 px-6 h-full bg-white ${corners} flex flex-col justify-between`;

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
    <div class={card}>
      <div class="flex justify-between">
        <h2 class="text-lg font-medium text-yellow-900">Shopping Cart</h2>
        <button
          class="py-1"
          onClick={(e) => {
            (e.target as HTMLButtonElement).closest("dialog")!.close();
          }}
        >
          <svg
            class="w-6 h-6 fill-current text-yellow-600"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      {props.cart && (
        <div class="flex-grow-1 my-4">
          {props.cart.lines.nodes.length === 0
            ? <p class="text-yellow-700">There are no items in the cart.</p>
            : (
              <ul role="list" class="-my-6 divide-y divide-yellow-200">
                {props.cart.lines.nodes.map((line) => (
                  <li class="flex py-6">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-yellow-200">
                      <img
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText ??
                          line.merchandise.product.title}
                        class="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div class="ml-4 flex flex-1 flex-col">
                      <div>
                        <div class="flex justify-between text-base font-medium text-yellow-900">
                          <h3>{line.merchandise.product.title}</h3>
                          <p class="ml-4">
                            {formatCurrency(line.estimatedCost.totalAmount)}
                          </p>
                        </div>
                        <p class="mt-1 text-sm text-yellow-500">
                          {line.merchandise.title !==
                              line.merchandise.product.title
                            ? line.merchandise.title
                            : ""}
                        </p>
                      </div>
                      <div class="flex flex-1 items-end justify-between text-sm">
                        <p class="text-yellow-500">
                          Quantity <strong>{line.quantity}</strong>
                        </p>

                        <div class="flex">
                          <button
                            type="button"
                            class="font-medium"
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
      {props.cart && (
        <div class="border-t border-yellow-200 py-6 px-4 sm:px-6">
          <div class="flex justify-between text-lg font-medium">
            <p>Subtotal</p>
            <p>{formatCurrency(props.cart.estimatedCost.totalAmount)}</p>
          </div>
          <p class="mt-0.5 text-sm text-yellow-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div class="mt-6">
            <button
              type="button"
              class="w-full bg-yellow-700 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-yellow-700"
              disabled={props.cart.lines.nodes.length === 0}
              onClick={handleCheckoutEvent}
            >
              Checkout
            </button>
          </div>
          <div class="mt-6 flex justify-center text-center text-sm text-yellow-500">
            <p>
              or&nbsp;
              <button
                type="button"
                class="font-medium"
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
