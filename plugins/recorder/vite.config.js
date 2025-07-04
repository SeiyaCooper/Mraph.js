import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            name: "mraph-recorder",
            entry: "src/mraph-recorder.js",
            fileName: (format) => `mraph-recorder.${format}.js`,
        },
    },
});
