import { CartIcon } from "@/components/cart-page/cart-icon.tsx";

export interface NavbarProps {
  cartSize: number;
}

export function Navbar(props: NavbarProps) {
  return (
    <header
      style={{
        width: "100%",
        backgroundImage: "none",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "6rem",
          position: "relative",
        }}
      >
        <a href="/">
          <img
            src="http://fartlabs.org/fl-logo.png"
            alt="FartLabs logo"
            style={{ height: "3.5rem", width: "3.5rem", borderRadius: "50%" }}
          />
        </a>
        <h1
          style={{
            fontFamily: "Overpass, sans-serif",
            fontWeight: "bold",
            color: "var(--fart-primary)",
          }}
        >
          <a href="/">
            <span class="shop-title">
              FartLabs
            </span>{" "}
            Shop
          </a>
        </h1>

        <a
          href="/your-cart"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CartIcon />
          <span>
            {props.cartSize}
          </span>
        </a>
      </nav>
    </header>
  );
}
