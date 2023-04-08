/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  options: {
    safelist: [],
    output: "./build/index.css",
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
