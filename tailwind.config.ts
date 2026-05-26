import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "athlos-dark": "#1a1a2e",
        "athlos-navy": "#16213e",
        "athlos-coral": "#e8533a",
        "athlos-orange": "#f4a340",
        "athlos-gold": "#f4c842",
        "athlos-teal": "#4ecdc4",
        "athlos-sky": "#45b7d1",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;
