import {defineConfig, passthroughImageService} from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";
import tailwindcssNesting from 'tailwindcss/nesting'
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    svelte(),
    icon({
      include: {
        ri: ['visa-line', 'graduation-cap-fill', 'file-text-fill', 'github-fill', 'linkedin-fill', 'discord-fill', 'google-fill'],
        mdi: ['login', 'logout', 'chevron-right', 'account-remove'],
        solar: ['arrow-left-outline', 'arrow-right-outline', 'alt-arrow-left-outline', 'alt-arrow-right-outline', 'hamburger-menu-outline'],
        ion: ['close']
      }
    }),
    mdx(),
    compress()
  ],
  output: "hybrid",
  adapter: vercel(),
  trailingSlash: "always",
  image: {
    service: passthroughImageService()
  },
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcssNesting()]
      }
    }
  }
});