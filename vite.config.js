import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  env: loadEnv("VUE_APP_", process.cwd()),
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
