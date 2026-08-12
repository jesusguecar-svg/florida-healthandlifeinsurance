import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the GitHub Pages workflow so asset URLs resolve under
// https://<user>.github.io/<repo>/. Local dev and preview keep the root path.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
});
