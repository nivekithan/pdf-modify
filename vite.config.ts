import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import windicss from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), windicss()],
});
