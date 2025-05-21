/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pixelify)", "Arial", "sans-serif"],
      },
      keyframes: {
        "smoke-word": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
            filter: "blur(8px)",
          },
          "80%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(2px)",
          },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
      },
      animation: {
        "smoke-word": "smoke-word .6s cubic-bezier(0.11,0.5,0,1) both",
      },
    },
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
};
