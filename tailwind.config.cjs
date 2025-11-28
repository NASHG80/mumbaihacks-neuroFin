/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",      // purple tone used in original HTML
        secondary: "#6366f1",    // indigo tone
      },

      boxShadow: {
        glow: "0 0 25px rgba(139,92,246,0.8), 0 0 50px rgba(99,102,241,0.7)",
        soft: "0 0 15px rgba(255,255,255,0.1)",
      },

      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        fadeUp: "fadeUp 0.8s ease-out forwards",
        float: "float 4s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
