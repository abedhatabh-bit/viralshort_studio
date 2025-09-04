import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    sourcemap: mode === 'development' ? false : true, // Disabled for dev for speed
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    tsconfigPaths(),
    react({
      // Enable fast refresh and other React optimizations
      fastRefresh: true,
      jsxRuntime: 'automatic'
    }),
    tagger()
  ],
  server: {
    port: 4029, // Changed to avoid conflict
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    hmr: {
      overlay: false // Disable error overlay for better performance
    },
    // Optimize dev server for speed
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom'
    ] // Removed UI libs to speed up initial startup for core dev functionality
  },
  css: {
    devSourcemap: false // Disable CSS sourcemaps for dev speed
  }
}));