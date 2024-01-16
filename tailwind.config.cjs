/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            boxShadow: {
                'custom-golden': '0 0 5px #FBBD23, 0 0 25px #FBBD23, 0 0 50px #FBBD23, 0 0 100px',
            },
            screens: {
                'xs': '400px',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('daisyui'),
        require('tailwindcss-animated'),
    ],
};