import {defineConfig, passthroughImageService} from 'astro/config';

import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";

// https://astro.build/config
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
      }
    }),
  ],
  output: "hybrid",
  image: {
    service: passthroughImageService(),
  },
});
