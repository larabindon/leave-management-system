/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      blue: "#295DEB",
      lightblue: "#eaeffd",
      darkblue: "#152f76",
      grey: {
        50: "#f6f7fa", //background
        300: "#d2d4db",
        900: "#464749",
      },
      success: "#11BB70"
    },
    extend: {
      fontFamily: {
        display: "Roboto, sans-serif",
        body: "Inter, sans-serif",
      },
    },
  },
  plugins: [],
};