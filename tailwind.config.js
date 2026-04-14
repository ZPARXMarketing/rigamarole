/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#111111",
        card: "#131313",
        card2: "#151515",
        card3: "#161616",
        border1: "#1a1a1a",
        border2: "#1e1e1e",
        border3: "#222222",
        accent: "#c4ff36",
        hit: "#4ade80",
        miss: "#f87171",
        maybe: "#facc15",
        textPrimary: "#eeeeee",
        textSecondary: "#888888",
        textMuted: "#555555",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
