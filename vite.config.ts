import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
})


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
