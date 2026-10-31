/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#652080',
          light: '#7E2FA0',
          dark: '#4D1566',
        },
        plum: {
          DEFAULT: '#35094F',
          deep: '#220436',
        },
        lavender: {
          DEFAULT: '#EDE2FA',
          soft: '#F7F2FD',
          mist: '#E3D1F7',
        },
        champagne: {
          DEFAULT: '#D9B56E',
          light: '#F3DFAF',
          dark: '#B58D3D',
        },
      },
      fontFamily: {
        serif: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        decorative: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 28px 70px -15px rgba(53, 9, 79, 0.22), 0 10px 28px -6px rgba(217, 181, 110, 0.18)',
        'envelope': '0 38px 85px -12px rgba(26, 2, 42, 0.65), 0 14px 34px -8px rgba(217, 181, 110, 0.28)',
        'gold-glow': '0 0 32px rgba(217, 181, 110, 0.55), 0 10px 24px rgba(53, 9, 79, 0.4)',
        'card': '0 18px 42px -12px rgba(53, 9, 79, 0.15), 0 4px 12px rgba(217, 181, 110, 0.12)',
      },
    },
  },
  plugins: [],
}
