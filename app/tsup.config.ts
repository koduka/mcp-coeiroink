import { defineConfig } from 'tsup'

const isProduction = process.env.NODE_ENV === "production";

console.log('isDev', process.env)

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: [
    "esm"
  ],
  minify: isProduction
})