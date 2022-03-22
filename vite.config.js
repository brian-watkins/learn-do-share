/**
 * @type {import('vite').UserConfig}
 */
const config = {
    root: "./display",
    server: {
        port: 7663,
        open: true,
        proxy: {
            "/messages": "http://localhost:7664"
        }
    }
}

export default config
