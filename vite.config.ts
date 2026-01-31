
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Permite que o código use process.env.API_KEY mesmo no ambiente de browser do Vite
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
