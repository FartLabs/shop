import { Cart } from "@/components/cart/cart.tsx";

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
      {
        /* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        class="rainfall"
      /> */
      }
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

        <Cart />
      </nav>
    </header>
  );
}
