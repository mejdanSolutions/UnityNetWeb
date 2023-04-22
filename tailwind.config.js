/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  options: {
    safelist: [],
    output: "./build/index.css",
  },
  theme: {
    extend: {},
    screens: {
      sm: "600px",
      md: "800px",
      lg: "1300px",
      xl: "1280px",
    },
  },
  plugins: [],
};
