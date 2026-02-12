
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        noir: "#0a0a0a",
        crimson: "#8B0000",
        gold: "#C9A94E",
        "gold-dim": "#8a7335",
        "amber-tint": "rgba(201,169,78,0.05)",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        body: ['"Cormorant Garamond"', "serif"],
      },
      backgroundImage: {
        'vignette': 'radial-gradient(circle, transparent 20%, #0a0a0a 130%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
