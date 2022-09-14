import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [svelte(), vue()],
})
