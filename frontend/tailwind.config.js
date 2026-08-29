/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rt: {
          bg: '#FFFBF7',
          surface: '#FFFFFF',
          surfacealt: '#FFF3E6',
          surfacehover: '#FFE8D1',
          border: '#F0DCC7',
          text: '#241708',
          muted: '#8C6A52',
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
        glow: '0 8px 20px -4px rgba(255, 106, 0, 0.35)',
        panel: '0 8px 24px -8px rgba(36, 23, 8, 0.12)',
        card: '0 2px 10px -2px rgba(36, 23, 8, 0.08)'
      },
      backgroundImage: {
        'rt-radial': 'radial-gradient(circle at 15% -10%, rgba(255,106,0,0.10), transparent 40%), radial-gradient(circle at 100% 10%, rgba(255,106,0,0.07), transparent 45%)'
      }
    }
  },
  plugins: []
};