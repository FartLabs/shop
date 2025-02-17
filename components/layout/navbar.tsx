import { CartIcon } from "../cart-page/cart-icon.tsx";

export function Navbar() {
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
          <span class="shop-title">
            FartLabs
          </span>{" "}
          Shop
        </h1>

        <a
          href="/cart"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CartIcon />
          <span>
            {0}
            {/* TODO: Add number of items in cart. */}
          </span>
        </a>
      </nav>
    </header>
  );
}
