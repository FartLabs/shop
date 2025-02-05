import Cart from "../islands/Cart.tsx";

export function Header() {
  return (
    <header
      class="h-[110px] sm:!h-[144px] w-full bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url(/header_bg.svg)",
      }}
    >
      <div class="rainfall w-full h-full absolute" />
      <nav class="w-11/12 h-24 max-w-5xl mx-auto flex items-center justify-between relative">
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
