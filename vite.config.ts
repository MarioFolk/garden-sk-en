import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const root = process.cwd();

export default defineConfig({
  plugins: [tsconfigPaths()],

  // CLIENT BUILD (WebView)
  build: {
    rollupOptions: {
      input: {
        game: path.resolve(root, 'src/client/game.html'),
        splash: path.resolve(root, 'src/client/splash.html')
      }
    },
    outDir: path.resolve(root, 'dist/client'),
    emptyOutDir: true
  },

  // SERVER BUILD
  buildServer: {
    lib: {
      entry: path.resolve(root, 'src/main.ts'),
      formats: ['cjs'],
      fileName: () => 'index.cjs'
    },
    outDir: path.resolve(root, 'dist/server'),
    emptyOutDir: true
  }
});
