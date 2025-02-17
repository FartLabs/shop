interface AddToCartProps {
  cartId: string;
  productId: string;
}

export function AddToCart(props: AddToCartProps) {
  return (
    <form method="POST" action="/add-to-cart">
      <input type="hidden" name="productId" value={props.productId} />
      <button type="submit" class="fart-button">
        Add to Cart
      </button>
    </form>
  );
}
