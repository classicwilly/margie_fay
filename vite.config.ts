import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      // ...existing code...
      plugins: [react()],
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
                if (id.includes('framer-motion')) return 'vendor-framer';
                if (id.includes('firebase')) return 'vendor-firebase';
                return 'vendor';
              }
            }
          }
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      envPrefix: ['VITE_', 'PLAYWRIGHT_'],
      resolve: {
        alias: {
          '@components': path.resolve(__dirname, 'src/components'),
          '@contexts': path.resolve(__dirname, 'src/contexts'),
          '@hooks': path.resolve(__dirname, 'hooks'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@types': path.resolve(__dirname, 'src/types.ts'),
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@data': path.resolve(__dirname, 'src/data')
        }
      }
    };
  });