import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  esbuild: {
    target: 'esnext',
    supported: {
      bigint: true
    }
  },
  plugins: [
    react(),
    legacy(),
  ],
  resolve: {
    alias: {
      'cblite-js': path.resolve(__dirname, 'node_modules/cbl-ionic')
    }
  }

 // test: {
 //   globals: true,
 //   environment: 'jsdom',
 //   setupFiles: './src/setupTests.ts',
 // }
})
