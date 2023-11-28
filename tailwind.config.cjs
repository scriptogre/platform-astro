/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
        'sans': ['Barlow', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont'], // Add other fallback fonts as required
        'mono': ['Bebas Neue', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    },
    extend: {
        boxShadow: {
            'custom-golden': '0 0 5px #FBBD23, 0 0 25px #FBBD23, 0 0 50px #FBBD23, 0 0 100px',
        },
    },
},
plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('tailwindcss-animated'),
],
};