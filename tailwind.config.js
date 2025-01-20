/** @type {import('tailwindcss').Config} */

const { Colors } = require("./utils/Colors");
import colors from "tailwindcss/colors";

module.exports = {
  darkMode: "class",
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    // colors: {
    //   current: "currentColor",
    //   ...colors,
    // },
    extend: {
      colors: Colors,
    },
  },
  plugins: [],
};
