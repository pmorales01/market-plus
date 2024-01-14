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
          '*' : {
            'font-family': 'Montserrat, sans-serif',
          },
          '.btn-primary': {
            'background-color': 'black',
            'color': 'white',
            'font': 'inherit',
            'text-transform': 'none',
          },
          '.btn': {
            'font-family': 'Montserrat, sans-serif',
            'border-radius': '0px',
            'letter-spacing': '.2em',
            'font-size': '13px'
          },
          '.title': {
            'font-size': '20px',
            'color': '#201e1f',
            'text-transform': 'uppercase',
            'letter-spacing': '.3em',
            'line-height': '1.65',
          },
          '.label-text': {
            'color': '#1c1b1b',
          },
          'input' : {
            'border-radius': '0px',
            'color': '#1c1b1b',
          },
          'p' : {
            'color': '#6a6a6a',
            'font-size': '13px',
            'font-weight': '500',
            'font-style': 'normal'
          },
          '.link' : {
            'color': '#6a6a6a',
            'font-size': '13px',
            'font-weight': '500',
          }
        },
        screens: {
          'sm': '535px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
        },
      },
    ],
  },


  plugins: [require("daisyui")],
}
