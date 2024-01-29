/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  important: true,
  theme: {
    screens: {
      'xs': '300px',
      'sm': '450px',
      'md': '575px',
      'lg': '1024px',
    },
  },
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
          '.input-container': {
            position: 'relative',
            'margin-bottom': '20px'
          },
          '.input-container input' : {
            'border-radius': '0px',
            color: '#6a6a6a',
            padding: '14px',
            height: '42px',
          },
          'input:focus + label, input:not(:placeholder-shown) + label': {
            top: '0',
            'font-size': '12px',
            'color': '#6a6a6a',
            'background-color': 'white',
            'padding': '0px 3px 0px 3px',
          },
          '.input-container label': {
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-55%)',
            'pointer-events': 'none',
            transition: 'all 0.3s ease',
            color: '#6a6a6a',
            'font-size': '12px',
            'font-weight': '500',
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
        }
      }
    ],
  },


  plugins: [require("daisyui")],
}
