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
      },
      build: {
        chunkSizeWarningLimit: 400,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id) return undefined;
                if (id.includes('node_modules')) {
                  if (id.includes('@firebase/app')) return 'firebase-app';
                  if (id.includes('@firebase/auth')) return 'firebase-auth';
                  if (id.includes('@firebase/firestore')) return 'firebase-firestore';
                  if (id.includes('@firebase/ai')) return 'firebase-ai';
                  if (id.includes('@firebase')) return 'firebase';
                  if (id.includes('node_modules/react-dom') || id.includes('node_modules/react')) return 'react';
                if (id.includes('@google/genai')) return 'genai';
                if (id.includes('framer-motion')) return 'motion';
                if (id.includes('firebase')) {
                  // Prefer a more granular split for firebase internals (app, auth, firestore)
                  if (id.includes('/auth')) return 'firebase-auth';
                  if (id.includes('/firestore')) return 'firebase-firestore';
                  if (id.includes('/app') || id.includes('/firebase')) return 'firebase-app';
                  return 'firebase';
                }
                if (id.includes('lucide-react')) return 'icons';
                if (id.includes('@sentry/browser')) return 'sentry';
                if (id.includes('dompurify')) return 'dompurify';
                if (id.includes('marked')) return 'marked';
                return 'vendor';
              }
              if (id.includes('/components/WillowsDashboard') || id.includes('/WillowsDashboardBuilder')) return 'willow-dashboard';
              if (id.includes('/components/WilliamsDashboard') || id.includes('/WilliamDashboardBuilder')) return 'william-dashboard';
              if (id.includes('/components/WeeklyReview')) return 'weekly-review';
              if (id.includes('/components/WonkyToolkit') || id.includes('/components/WeeklyReview')) return 'toolkit';
              if (id.includes('/components/SopVault')) return 'sop-vault';
              if (id.includes('/components/Manifesto')) return 'manifesto';
              if (id.includes('/components/ProtocolView')) return 'protocols';
              if (id.includes('/components/CommandCenter')) return 'command-center';
              if (id.includes('/components/GameMasterDashboard')) return 'game-master-dashboard';
              return undefined;
            }
          }
        }
      }
    };
  });