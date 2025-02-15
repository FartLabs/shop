import { Cart } from "@/components/cart/cart.tsx";

export function Navbar() {
  return (
    <header class="w-full bg-no-repeat bg-cover relative">
      <div class="rainfall w-full h-full absolute" />
      <nav class="container mx-auto flex items-center justify-between h-24 relative">
        <a href="/">
          <img
            src="http://fartlabs.org/fl-logo.png"
            alt="FartLabs logo"
            class="h-14 w-14 rounded-full"
          />
        </a>
        <h1
          class="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ fontFamily: "Overpass, sans-serif" }}
        >
          <span class="hidden sm:inline">FartLabs</span> Shop
        </h1>

        <Cart />
      </nav>
    </header>
  );
}
