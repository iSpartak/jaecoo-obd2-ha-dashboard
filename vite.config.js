/**
 * Vite Configuration File for Home Assistant Lovelace Card Plugin.
 * Compiles modular ES6 code and encapsulated CSS into a unified production script.
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // Specifies the production folder destination
    outDir: 'dist',

    // Wipes out old contents from the dist folder before compiling a fresh payload
    emptyOutDir: true,

    // Configures Vite to build a reusable plugin library rather than a standard webpage website
    lib: {
      // Points to the primary orchestration bootstrap entry file
      entry: resolve(__dirname, 'src/main.js'),

      // Global variable exposure identifier for the bundled payload browser ecosystem
      name: 'JaecooObd2DashboardCard',

      // IIFE (Immediately Invoked Function Expression) perfectly packages standalone plugins for HA
      formats: ['iife'],

      // Names the finalized output file asset
      fileName: () => 'jaecoo-obd2-card.js'
    },

    rollupOptions: {
      output: {
        // Keeps the folder tree clean and manages direct media assets cleanly within an independent folder
        assetFileNames: 'assets/[name].[ext]'
      }
    },

    // Minimizes production payload weight while preserving readability for troubleshooting
    minify: 'esbuild',
    sourcemap: false
  }
});
