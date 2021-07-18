module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfbf8',
          100: '#faf7f1',
          200: '#f4ebdb',
          300: '#eddfc5',
          400: '#dfc79a',
          500: '#d1af6f',
          600: '#bc9e64',
          700: '#9d8353',
          800: '#7d6943',
          900: '#665636',
        },
        secondary: {
          50: '#f5f6f9',
          100: '#eaeef4',
          200: '#cbd3e3',
          300: '#abb9d3',
          400: '#6d85b1',
          500: '#2e5090',
          600: '#294882',
          700: '#233c6c',
          800: '#1c3056',
          900: '#172747',
        },
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-focus'],
  },
  plugins: [],
};
