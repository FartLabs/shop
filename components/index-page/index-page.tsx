import type { List, Product } from "@/lib/shopify/mod.ts";
import { graphql } from "@/lib/shopify/mod.ts";
import { Layout } from "@/components/layout/layout.tsx";
import { ProductCard } from "@/components/product-page/product-card.tsx";

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
  cartSize: number;
  products: List<Product>;
}

export function IndexPage(props: IndexPageProps) {
  return (
    <Layout url={props.url} cartSize={props.cartSize}>
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
