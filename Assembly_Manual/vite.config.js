import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'

export default {
    base: '/loci-lamp-docs/',
    plugins:
        [
            react(),
            glsl()
        ],
    root: 'src/',
    publicDir: "../public/",
    base: './',
    server:
    {
        host: true,
    },
    build:
    {
        target: 'es2019',
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
}
