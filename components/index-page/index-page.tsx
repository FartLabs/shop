import type { List, Product } from "@/lib/shopify/mod.ts";
import { formatCurrency, graphql } from "@/lib/shopify/mod.ts";
import Layout from "@/components/layout/layout.tsx";
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
  console.dir({ props }, { depth: null }); // TODO: Remove.

  return (
    <Layout url={props.url}>
      <div
        class="w-11/12 max-w-5xl mx-auto mt-28"
        aria-labelledby="information-heading"
      >
        <h2 id="information-heading" class="sr-only">
          Product List
        </h2>
        <div class="grid grid-cols-1 gap-8 sm:!gap-x-10 sm:!grid-cols-2 lg:!grid-cols-3 lg:!gap-x-12 lg:!gap-y-10">
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
    <a key={product.id} href={`/products/${product.handle}`} class="group">
      <div
        class={`w-full bg-white rounded-xl overflow-hidden border-2 border-yellow-200 transition-all duration-500 relative`}
      >
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width="400"
            height="400"
            class="w-full h-full object-center object-contain absolute block"
          />
        )}
        <div class="w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-500">
          <CartIcon size={30} />
        </div>
      </div>
      <div class="flex items-center justify-between mt-3">
        <h3 class="text-lg text-yellow-800 font-medium relative">
          {product.title}
          <span class="bg-yellow-800 h-[3px] w-0 group-hover:!w-full absolute bottom-[-2px] left-0 transition-all duration-400" />
        </h3>
        <strong class="text-lg font-bold text-yellow-800">
          {formatCurrency(product.priceRange.minVariantPrice)}
        </strong>
      </div>
    </a>
  );
}
