import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this line to match your repository name exactly
  base: "/indonesia-batik-image-classification/",
})