module.exports = {
  content: [
    "./src/**/*.ts"
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '136': '40rem'
      },
      keyframes: {
        slidein: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        slidein: 'slidein .5s ease-in-out 1',
      }
    },
  },
  plugins: [],
}
