import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      jquery: "jquery/dist/jquery.min.js",
    },
  },
  optimizeDeps: {
    include: ["jquery"], // Asegúrate de que Vite optimice jQuery
  },
});
