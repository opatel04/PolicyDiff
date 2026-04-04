/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // PolicyDiff semantic palette
        restrictive: "#ef4444",
        moderate: "#eab308",
        relaxed: "#22c55e",
        neutral: "#6b7280",
        background: "#0f172a",
        surface: "#1e293b",
        border: "#334155",
      },
    },
  },
  plugins: [],
};
