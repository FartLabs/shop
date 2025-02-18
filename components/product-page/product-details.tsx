import type { Product } from "@/lib/shopify/mod.ts";
import { formatCurrency } from "@/lib/shopify/mod.ts";
import { AddToCart } from "./add-to-cart.tsx";
import { ProductCardPicture } from "./product-card.tsx";
import { borderTubeColorAt } from "@/lib/border-tubes/border-tubes.tsx";

export interface ProductDetailsProps {
  product: Product;
  cartId: string;
  cartSize: number;
}

export function ProductDetails(props: ProductDetailsProps) {
  return (
    <section>
      {/* Product details */}
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <hgroup>
              <h2 style={{ fontWeight: "bold" }}>{props.product.title}</h2>
              <h3>{props.product.productType}</h3>
            </hgroup>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                }}
              >
                {formatCurrency(props.product.variants.nodes[0].priceV2)}
              </p>

              {props.product.variants.nodes[0].availableForSale && (
                <p style={{ marginTop: "1rem", fontSize: "initial" }}>
                  <AddToCart
                    productId={props.product.variants.nodes[0].id}
                    cartId={props.cartId}
                  />
                </p>
              )}

              {props.cartSize > 0 && (
                <p style={{ marginTop: "1rem", fontSize: "initial" }}>
                  <a href="/your-cart" class="fart-button">
                    View Cart
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        <section style={{ marginTop: "2rem", borderTop: "1px solid #E8E7E5" }}>
          <h2 style={{ display: "none" }}>Product information</h2>

          {!props.product.variants.nodes[0].availableForSale && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "1rem", color: "gray" }}>
                Out of stock
              </p>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <p
              style={{ fontSize: "1rem", color: "gray" }}
              dangerouslySetInnerHTML={{
                __html: props.product.descriptionHtml,
              }}
            />
          </div>
        </section>
      </div>

      {/* Product images */}
      <div>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {props.product.images?.nodes.map((image, index) => (
            <li key={index}>
              <ProductCardPicture
                src={image.url}
                alt={image.altText}
                borderTubeColor={borderTubeColorAt(index)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Product form */}
      <div style={{ marginTop: "2rem" }}>
        <section>
          {props.product.variants.nodes.length > 1 && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  borderWidth: "2px",
                  borderColor: "#E8E7E5",
                }}
              >
                <span style={{ display: "none" }}>
                  /* space holderplace, don't remove */
                </span>
                <span style={{ color: "gray", transition: "color 0.2s" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 5.85716L8 3.00002L11 5.85716"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 10.1429L8 13L5 10.1429"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <select
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    appearance: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {props.product.variants.nodes.map((variant) => {
                    return (
                      <option>
                        {variant.title}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
