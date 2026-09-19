import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// /data/* отдаёт локальный сервер с данными: python3 -m http.server 8888 --directory ../prepare-data
const proxy = {
  '/data': {
    target: 'http://localhost:8888',
    rewrite: (path: string) => path.replace(/^\/data/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
