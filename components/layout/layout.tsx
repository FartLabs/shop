import type { HeadProps } from "./head.tsx";
import { Head } from "./head.tsx";
import { Navbar } from "./navbar.tsx";
import { Footer } from "./footer.tsx";

export interface LayoutProps extends Partial<HeadProps> {
  // deno-lint-ignore no-explicit-any
  children: any;
}

export function Layout(props: LayoutProps) {
  return (
    <html lang="en">
      <Head
        url={props.url ?? new URL("https://shop.fartlabs.org")}
        title={props.title ?? "FartLabs Shop"}
        description={props.description ?? "Shop at the FartLabs Shop!"}
        image={props.image ?? "https://fartlabs.org/og-image.png"}
      />

      <Navbar />
      {props.children}
      <Footer />
    </html>
  );
}
