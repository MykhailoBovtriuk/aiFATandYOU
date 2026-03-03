/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0A0A1A",
        "dark-card": "#12161D",
        "dark-surface": "#1E222B",
        "dark-border": "#2C303A",
        "accent-green": "#289556",
        "accent-blue": "#3B82F6",
        "text-primary": "#FFFFFF",
        "text-secondary": "#9CA3AF",
        "text-muted": "#A0A5B1",
        placeholder: "#6B7280",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
