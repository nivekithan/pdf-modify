import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import windicss from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), windicss(), svgr()],
  resolve: {
    alias: {
      "~hooks": path.resolve(__dirname, "src", "hooks"),
      "~svg": path.resolve(__dirname, "src", "svg"),
      "~store": path.resolve(__dirname, "src", "store"),
      "~utils": path.resolve(__dirname, "src", "utils"),
      "~context": path.resolve(__dirname, "src", "context"),
      src: path.resolve(__dirname, "src"),
    },
  },
});
