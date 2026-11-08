import { defineConfig } from 'vitest/config'

// Unit tests cover the pure logic in app/utils and app/data, so they run in plain Node without Nuxt.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node'
  }
})
