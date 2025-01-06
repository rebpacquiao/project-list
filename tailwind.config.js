/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  screens: {
    "2xsm": "375px",
    xsm: "425px",
    "3xl": "2000px",
  },
  plugins: [],
};
