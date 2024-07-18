/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '840px',
          lg: '1024px',
          xl: '1260px',
        },
      },
      backgroundImage: {
        'custom-image': "url('https://i.pinimg.com/564x/36/a0/85/36a085785eabcc6add04d35e8c97be37.jpg')",
      },
      colors: {
        brown: {
          200: '#e8d3b3',
          300: '#d2b48c',
          500: '#a0522d',
          700: '#8b4513',
          800: '#5a3310',
        },
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-small': 'repeat(auto-fill, minmax(170px, 1fr))',
      }
    },
  },
  plugins: [],
}