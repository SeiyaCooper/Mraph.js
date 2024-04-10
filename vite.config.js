import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/mraph.js",
            formats: ["es"],
        },
    },
});
