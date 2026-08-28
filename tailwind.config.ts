import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        muted: "var(--muted)",
        navy: {
          50: "#eef2f8",
          100: "#d7e0ee",
          200: "#b0c1dd",
          300: "#84a0c9",
          400: "#5a7fb4",
          500: "#3d629b",
          600: "#2c4c7d",
          700: "#1f3860",
          800: "#152845",
          900: "#0c1930",
          950: "#070f1e",
        },
        gold: {
          50: "#fdf9ec",
          100: "#faf0cb",
          200: "#f4dd93",
          300: "#eec55a",
          400: "#e8ac35",
          500: "#d99320",
          600: "#bb7318",
          700: "#955417",
          800: "#7a4419",
          900: "#673a19",
        },
        up: "#16a34a",
        down: "#dc2626",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)",
        "card-hover":
          "0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06)",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
