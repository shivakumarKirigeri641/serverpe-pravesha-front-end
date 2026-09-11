/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // WhatsApp's greens, because the service lives there, set against the
        // colours of a Western Ghats morning: forest, mist and first light.
        brand: { DEFAULT: '#075e54', light: '#128c7e', accent: '#00a884', deep: '#053f38' },
        forest: { 900: '#0b2a22', 800: '#0f3a2f', 700: '#14503f', 600: '#1d6b54' },
        mist: { 50: '#f4f9f7', 100: '#e7f2ee', 200: '#cfe5dc' },
        sunrise: { 300: '#ffd48a', 400: '#f9b84a', 500: '#f59e0b' },
        ink: '#0d1b1e', muted: '#5d7169', line: '#e2ebe8',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Kannada"', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans Kannada"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(13,27,30,.04), 0 8px 30px rgba(13,27,30,.07)',
        lift: '0 18px 50px rgba(7,94,84,.22)',
      },
      keyframes: {
        drift: { '0%': { transform: 'translateX(-6%)' }, '100%': { transform: 'translateX(6%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        drift: 'drift 22s ease-in-out infinite alternate',
        driftSlow: 'drift 36s ease-in-out infinite alternate-reverse',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
