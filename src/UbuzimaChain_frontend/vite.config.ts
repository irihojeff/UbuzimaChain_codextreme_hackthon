import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin({
      // Define your environment variables here
      NODE_ENV: 'development',
      // Add other environment variables as needed
    }),
  ],
});
