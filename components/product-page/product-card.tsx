import type { Product } from "@/lib/shopify/mod.ts";
import { formatCurrency } from "@/lib/shopify/mod.ts";
import type { BorderTubeColor } from "@/lib/border-tubes/border-tubes.tsx";

export interface ProductCardProps {
  product: Product;
  borderTubeColor?: BorderTubeColor;
}

export function ProductCard(props: ProductCardProps) {
  const featuredImageSrc = props.product.featuredImage?.url ?? "";
  const featuredImageAlt = props.product.featuredImage?.altText ?? "";
  return (
    <a
      key={props.product.id}
      href={`/products/${props.product.handle}`}
    >
      <ProductCardPicture
        src={featuredImageSrc}
        alt={featuredImageAlt}
        borderTubeColor={props.borderTubeColor}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.75rem",
        }}
      >
        <h3>{props.product.title}</h3>
        <strong>
          {formatCurrency(props.product.priceRange.minVariantPrice)}
        </strong>
      </div>
    </a>
  );
}

export interface ProductCardPictureProps {
  alt: string;
  src: string;
  borderTubeColor?: BorderTubeColor;
}

export function ProductCardPicture(props: ProductCardPictureProps) {
  return (
    <div
      class={`border-tube-${props.borderTubeColor ?? "green"} glow`}
      style={{
        aspectRatio: "1 / 1",
      }}
    >
      <img
        src={props.src}
        alt={props.alt}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
