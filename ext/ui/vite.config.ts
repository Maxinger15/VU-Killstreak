import vext from '@vextjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        vext({
            outputPath: '../',
        }),
    ],
    base: './', // Important for relative paths in Gameface
    build: {
        target: 'es2020',
        cssCodeSplit: false,
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
        sourcemap: true,
        minify: false,
    },
});
