/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
        reporters: ['verbose'],
        include: ['**/*.{test,spec}.{ts,tsx}'],
        exclude: ['e2e/**', 'playwright.config.ts', 'node_modules/**', 'dist/**'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*'],
            exclude: [],
        }
    },
})
