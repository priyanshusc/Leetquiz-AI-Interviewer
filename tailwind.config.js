// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neumorphic': '10px 10px 30px #bec4d1, -10px -10px 30px #ffffff',
        'neumorphic-inset': 'inset 10px 10px 30px #bec4d1, inset -10px -10px 30px #ffffff',
      }
    }
  },
  plugins: [],
}
