import { Cart } from "@/components/cart/cart.tsx";

export function Navbar() {
  return (
    <header>
      {/* <div class="rainfall" /> */}
      <nav>
        <a href="/">
          <img src="http://fartlabs.org/fl-logo.png" alt="FartLabs logo" />
        </a>
        <h1
          style={{ fontFamily: "Overpass, sans-serif" }}
        >
          <span>FartLabs</span> Shop
        </h1>

        <Cart />
      </nav>
    </header>
  );
}
