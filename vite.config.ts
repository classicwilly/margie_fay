import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      // ...existing code...
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@components': path.resolve(__dirname, 'components'),
          '@contexts': path.resolve(__dirname, 'src/contexts'),
          '@hooks': path.resolve(__dirname, 'hooks'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@types': path.resolve(__dirname, 'src/types.ts'),
          '@utils': path.resolve(__dirname, 'src/utils')
        }
      }
    };
  });