import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    srcDir: "./site",
    publicDir: "./site/public",
    site: "https://seiyacooper.github.io",
    base: "/Mraph.js",
    markdown: {
        shikiConfig: {
            theme: "github-dark",
        },
    },
});
