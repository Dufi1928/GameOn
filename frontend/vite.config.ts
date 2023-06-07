import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
  },
});
