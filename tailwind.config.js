/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#f5f1e8",
        panel: "#ffffff",
        accent: "#d96b3b",
      },
    },
  },
  plugins: [],
};
