/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    colors: {
      base: "#282828",
      fg: "#ebddd2",
      red: "#cc241d",
      aqua: "#8ec07c",
      bg1: "#3c3836",
      bg0_h: "#1d2021",
      blue: "#458588",
      yellow: "#fabd2f"
    },
    extend: {},
  },
  plugins: [    require('@tailwindcss/typography'),
  ],
};
