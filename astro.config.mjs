import { defineConfig } from 'astro/config';

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://api.flow.dev",
  output: "server",
  adapter: node({ mode: 'standalone' })
});