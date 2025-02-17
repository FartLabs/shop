import type { List, Product } from "@/lib/shopify/mod.ts";
import { formatCurrency, graphql } from "@/lib/shopify/mod.ts";
import { Layout } from "@/components/layout/layout.tsx";
import { CartIcon } from "../cart-page/cart-icon.tsx";

export async function queryIndexPage() {
  return await graphql<{ products: List<Product> }>(indexPageQuery);
}

export const indexPageQuery = `{
  products(first: 20) {
    nodes {
      id
      handle
      title
      featuredImage {
        url(transform: {preferredContentType: WEBP, maxWidth:400, maxHeight:400})
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
}`;

export interface IndexPageProps {
  url: URL;
  products: List<Product>;
}

export function IndexPage(props: IndexPageProps) {
  return (
    <Layout url={props.url}>
      <section aria-labelledby="information-heading" class="fart-section">
        <h2 id="information-heading">
          Collection
        </h2>
        <div>
          {props.products.nodes.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function ProductCard(props: { product: Product }) {
  const { product } = props;
  return (
    <a
      key={product.id}
      href={`/products/${product.handle}`}
    >
      {/* TODO: Use tube borders. https://github.com/EthanThatOneKid/border-tube-code-generator */}
      <div
        style={{
          position: "relative",
          display: "block",
          overflow: "hidden",
          borderRadius: "1rem",
          border: "2px solid var(--fart-primary)",
          transition: "all 0.5s",
          backgroundColor: "white",
        }}
      >
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width="400"
            height="400"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              position: "absolute",
              display: "block",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            opacity: 0,
            transition: "all 0.5s",
          }}
        >
          <div>
            <CartIcon size={30} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.75rem",
        }}
      >
        <h3>{product.title}</h3>
        <strong>{formatCurrency(product.priceRange.minVariantPrice)}</strong>
      </div>
    </a>
  );
}
