import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // permite acesso externo (ex: localhost fora do container)
    port: 5173,         // porta padrão usada no Dockerfile
    strictPort: true,   // falha caso a porta esteja em uso
  }
})
