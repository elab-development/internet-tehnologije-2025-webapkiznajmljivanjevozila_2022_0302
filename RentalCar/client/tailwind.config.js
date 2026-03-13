/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {

      colors: {

        // primary theme
        primary: "#C6A96B",
        "primary-dark": "#A8894E",

        // backgrounds
        dark: "#0f1115",
        "dark-soft": "#161a20",

        // text
        "text-main": "#E5E5E5",
        "text-muted": "#9CA3AF",

        // borders
        border: "#2A2F36",

        // luxury gold gradient helper
        gold: {
          light: "#F5E6B3",
          DEFAULT: "#C6A96B",
          dark: "#A8894E",
        },
      },

      fontFamily: {
        primary: ["Outfit", "sans-serif"],
      },

      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C6A96B, #F5E6B3)",
        "dark-gradient":
          "linear-gradient(180deg, #0f1115, #161a20)",
      },

      boxShadow: {
        luxury: "0 10px 30px rgba(0,0,0,0.5)",
      },

      borderRadius: {
        luxury: "18px",
      },
    },
  },

  plugins: [],
};