import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import http from 'http'
import { spawn } from 'child_process'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'auto-start-backend',
      configureServer() {
        // Automatically ensure backend is active whenever Vite dev server starts
        const check = http.get('http://127.0.0.1:5001/api/health', (res) => {
          if (res.statusCode === 200 || res.statusCode === 503) {
            console.log('[Vite] Havenly backend service detected on port 5001.');
          }
        });

        check.on('error', () => {
          console.log('[Vite] Backend is not active on port 5001. Automatically launching backend service...');
          const backendProc = spawn('node', ['server.js'], {
            cwd: path.resolve(process.cwd(), 'backend'),
            stdio: 'inherit',
            env: process.env,
          });

          const cleanup = () => {
            try {
              backendProc.kill();
            } catch (e) {}
          };

          process.on('exit', cleanup);
          process.on('SIGINT', cleanup);
          process.on('SIGTERM', cleanup);
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
