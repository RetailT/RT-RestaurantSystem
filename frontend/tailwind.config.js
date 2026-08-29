/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rt: {
          black: '#140D08',
          charcoal: '#1F150D',
          card: '#2A1B10',
          cardhover: '#3A2414',
          border: '#4A2E16',
          orange: {
            50: '#FFF4EB',
            100: '#FFE3CC',
            200: '#FFC498',
            300: '#FFA05C',
            400: '#FF8730',
            500: '#FF6A00',
            600: '#E85D00',
            700: '#C24A00',
            800: '#8F3600',
            900: '#5C2300'
          }
        }
      },
      fontFamily: {
        display: ['"Rajdhani"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(255, 106, 0, 0.45)',
        panel: '0 10px 30px -10px rgba(0,0,0,0.6)'
      },
      backgroundImage: {
        'rt-radial': 'radial-gradient(circle at 20% 0%, rgba(255,106,0,0.18), transparent 45%), radial-gradient(circle at 100% 100%, rgba(255,106,0,0.10), transparent 50%)'
      }
    }
  },
  plugins: []
};
