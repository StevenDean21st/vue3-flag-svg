import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { define } from "./define.js";

// https://vitejs.dev/config/
export default defineConfig({
  define,
  plugins: [vue()],
  build: {
    outDir: "lib",
    lib: {
      entry: resolve(__dirname, "index.js"),
      name: "Vue3FlagSVG",
      fileName: "vue3_flag_svg",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
  },
});
