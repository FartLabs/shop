import type { List, Product } from "@/lib/shopify/mod.ts";
import { formatCurrency, graphql } from "@/lib/shopify/mod.ts";
import { Layout } from "@/components/layout/layout.tsx";
import { CartIcon } from "@/components/cart/cart-icon.tsx";

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
      <div aria-labelledby="information-heading">
        <h2 id="information-heading">
          Product List
        </h2>
        <div>
          {props.products.nodes.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

function ProductCard(props: { product: Product }) {
  const { product } = props;
  return (
    <a key={product.id} href={`/products/${product.handle}`}>
      <div>
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width="400"
            height="400"
          />
        )}
        <div>
          <CartIcon size={30} />
        </div>
      </div>
      <div>
        <h3>
          {product.title}
          <span />
        </h3>
        <strong>
          {formatCurrency(product.priceRange.minVariantPrice)}
        </strong>
      </div>
    </a>
  );
}
