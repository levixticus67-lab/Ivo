/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sapphire: { 950: "#0F172A", 900: "#14213D", 800: "#1E3A8A" },
        azure: { 500: "#2563EB", 400: "#60A5FA" },
      },
      boxShadow: { glow: "0 24px 80px rgba(37, 99, 235, .20)" },
    },
  },
  plugins: [],
};
