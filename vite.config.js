/**
 * @type {import('vite').UserConfig}
 */
const config = {
    root: "./display",
    server: {
        port: 7663,
        open: true,
        proxy: {
            "/api/backstage": "http://localhost:7664"
        }
    },
    build: {
        outDir: "../build/display",
        emptyOutDir: true
    }
}

export default config
