// vite.config.js
import { defineConfig } from 'vite'
export default defineConfig(({ mode }) => {
    return {
        base: './',
        build: {
            minify: 'esbuild',
        },
        esbuild: {
            pure: mode === 'production' ? ['console.log'] : [],
        },
    }
})
