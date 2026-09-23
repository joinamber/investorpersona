import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the Pages workflow (e.g. "/investorpersona"); empty for a custom domain or local dev.
export default defineConfig({
  base: `${process.env.BASE_PATH ?? ''}/`,
  plugins: [react()],
});
