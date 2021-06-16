import { defineConfig } from "vite-plugin-windicss";
import windiForms from "windicss/plugin/forms";

export default defineConfig({
  theme: {
    extend: {
      boxShadow: {
        action: "0 5px 30px 0 rgba(0, 0, 0, .3)",
        pdf: "0  0 5px 0px rgba(0, 0, 0, 0.2)",
      },

      colors: {
        white: {
          hover: {
            DEFAULT: "#ebebeb",
            darker: "#dedede",
          },
        },
      },
    },
  },
  plugins: [windiForms],
});
