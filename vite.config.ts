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
        alias: [
          { find: '@', replacement: path.resolve(__dirname, '.') },
          { find: '@hooks', replacement: path.resolve(__dirname, 'hooks') },
          { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') },
          // primary alias used in imports. During the migration we support the legacy 'components/*' folder
          // to make sure runtime resolution (vite) matches TypeScript's fallback paths. Adjust later to 'src/components'.
          // support both bare and subpath imports (e.g. '@components/ErrorBoundary')
          // Primary alias for legacy `components` location; keep `@components-src` for src/components
          { find: /^@components\/(.*)$/, replacement: path.resolve(__dirname, 'components') + '/$1' },
          { find: '@components', replacement: path.resolve(__dirname, 'components') },
          // Keep a legacy alias for the original root `components` folder
          { find: '@components-root', replacement: path.resolve(__dirname, 'components') },
          { find: /^@components-src\/(.*)$/, replacement: path.resolve(__dirname, 'src/components') + '/$1' },
          { find: '@components-src', replacement: path.resolve(__dirname, 'src/components') },
          // fallback to legacy root folder while migrating to src/components (kept for compatibility)
          // legacy import path to support transitional imports before full migration
          { find: 'components', replacement: path.resolve(__dirname, 'components') },
          // alias for utilities — keep Vite and TypeScript paths in sync
          { find: /^@utils\/(.*)$/, replacement: path.resolve(__dirname, 'src/utils') + '/$1' },
          { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        ]
      }
    };
  });