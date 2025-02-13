import { HeadElement, HeadProps } from "@/components/HeadElement.tsx";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";

export interface LayoutProps extends Partial<HeadProps> {
  // deno-lint-ignore no-explicit-any
  children?: any;
}

export default function Layout(props: LayoutProps) {
  return (
    <>
      <HeadElement
        url={props.url ?? new URL("https://shop.fartlabs.org")}
        title={props.title ?? "FartLabs Shop"}
        description={props.description ?? "Shop at the FartLabs Shop!"}
        image={props.image ?? "https://fartlabs.org/og-image.png"}
      />
      <Header />
      {props.children}
      <Footer />
    </>
  );
}
