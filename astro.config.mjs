import {defineConfig, passthroughImageService} from 'astro/config';

import vercel from '@astrojs/vercel/serverless';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    svelte(),
    icon({
      include: {
        ri: ['visa-line', 'graduation-cap-fill', 'file-text-fill', 'github-fill', 'linkedin-fill', 'discord-fill', 'google-fill'],
        mdi: ['login', 'logout', 'chevron-right'],
        solar: ['arrow-left-outline', 'arrow-right-outline', 'alt-arrow-left-outline', 'alt-arrow-right-outline', 'hamburger-menu-outline'],
        ion: ['close'],
      },
    }),
  ],
  output: "hybrid",
  adapter: vercel(),
  image: {
    service: passthroughImageService(),
  },
});
