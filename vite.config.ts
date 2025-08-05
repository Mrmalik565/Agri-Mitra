import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    // Set the base path for deployment to match your GitHub repository name
    base: '/Agri-Mitra/', 
    plugins: [react()],
    define: {
      // Expose environment variables to the client.
      // Vite will replace this with the value of VITE_API_KEY at build time.
      'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
    },
    build: {
      outDir: 'dist'
    }
  }
})