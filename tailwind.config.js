const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
      colors: {

      },
      textColors: {
          
      },
    extend: {
      backgroundImage: {
          
        },
        colors: {
          ...colors
        }
    },
  },
}

