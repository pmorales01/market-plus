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
          '.btn-primary:hover': {
            'background-color': 'red'
          },
          'span': {
            'font-size': '14px'
          }
        },
      },
    ],
  },


  plugins: [require("daisyui")],
}
