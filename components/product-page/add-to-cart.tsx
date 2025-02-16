import { useState } from "preact/hooks";
import { addToCart } from "@/lib/shopify/mod.ts";

interface AddToCartProps {
  cartId: string;
  productId: string;
}

export function AddToCart(props: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false);

  const add = (e: MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(props.cartId, props.productId)
      .finally(() => {
        setIsAdding(false);
      });
  };

  return (
    <button onClick={add} disabled={isAdding} class="fart-button">
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
