import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  noExternal: ['nubbins-common'],
})
