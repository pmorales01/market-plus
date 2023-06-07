/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'], 
          primary: '#28BFF6',
          secondary: '#F08590',
          fontFamily: 'ui-monospace',
          '.btn-primary:hover': {
            'background-color': 'red'
          },
          'span': {
            'font-size': '14px'
          },
          '.title': {
            'color': '#F08590',
            'font-size': '2.25rem',
            'line-height': '2.5rem',
            'font-weight': '500'
          }
        },
      },
    ],
  },


  plugins: [require("daisyui")],
}
