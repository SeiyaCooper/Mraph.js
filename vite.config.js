import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            name: "mraph",
            entry: "src/mraph.js",
            fileName: (format) => `mraph.${format}.js`,
        },
    },
});
