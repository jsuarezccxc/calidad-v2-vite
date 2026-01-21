import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Use 'REACT_APP_' prefix to only load relevant variables
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  // Build define object with individual process.env.* replacements
  const envDefine: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode),
  };

  // Add each REACT_APP_* variable individually
  Object.keys(env).forEach((key) => {
    envDefine[`process.env.${key}`] = JSON.stringify(env[key]);
  });

  return {
    // Define process.env for CRA compatibility
    define: envDefine,
    plugins: [
    react({
      // Use React 18 JSX transform
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/App'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@information-texts': path.resolve(__dirname, './src/information-texts'),
      '@models': path.resolve(__dirname, './src/models'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@api': path.resolve(__dirname, './src/api'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@requests': path.resolve(__dirname, './src/requests'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Allow importing scss files without extensions
        additionalData: '',
        // Fix font path resolution - set includePaths to resolve from src
        includePaths: [path.resolve(__dirname, './src')],
        // Silence deprecation warnings for legacy APIs
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    // Optimization for large projects
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['redux', 'react-redux', 'redux-persist', 'redux-thunk'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'charts-vendor': ['recharts'],
          'fullcalendar-vendor': ['@fullcalendar/react', '@fullcalendar/daygrid', '@fullcalendar/interaction', '@fullcalendar/timegrid'],
        },
      },
    },
    // Drop console in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    // Fast refresh
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 3000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'redux',
      'redux-persist',
      '@mui/material',
      'recharts',
      'dayjs',
      'i18next',
      'react-i18next',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/interaction',
      '@fullcalendar/timegrid',
    ],
    // FullCalendar 6.x is now compatible with Vite
    exclude: [],
    // Force pre-bundling for CJS dependencies
    esbuildOptions: {
      target: 'es2015',
    },
  },
  // Environment variables prefix (same as CRA)
  envPrefix: 'REACT_APP_',
  };
});
