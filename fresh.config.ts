import { defineConfig } from "$fresh/server.ts";
import twind from "$fresh/plugins/twindv1.ts";
import twindConfig from "./twind.config.ts";

export default defineConfig({
  // deno-lint-ignore no-explicit-any
  plugins: [twind(twindConfig as any)],
});
