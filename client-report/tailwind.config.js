/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'kennislink-light-gray': '#C6C6C6',
                'kennislink-menu-bg': '#FAFAFA',
                'kennislink-tag-bg': '#F4F4F4',
                'kennislink-tag-border': '#BFBFBF',
                'kennislink-dark-gray': '#464646',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [require('daisyui')],
    themes: ['light'],
    daisyui: {
        themes: [
            {
                light: {
                    primary: 'oklch(49.12% 0.3096 275.75)',
                    secondary: 'oklch(69.71% 0.329 342.55)',
                    'secondary-content': 'oklch(98.71% 0.0106 342.55)',
                    accent: 'oklch(76.76% 0.184 183.61)',
                    neutral: '#2B3440',
                    'neutral-content': '#D7DDE4',
                    'base-100': 'oklch(100% 0 0)',
                    'base-200': '#F2F2F2',
                    'base-300': '#E5E6E6',
                    'base-content': '#1f2937',
                },
            },
        ],
    },
}
