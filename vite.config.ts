// Cambia la importación de 'vite' a 'vitest/config'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ... tus plugins
  test: {
    globals: true,
    environment: 'istanbul',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/', 
        'dist/', 
        'vite.config.ts',
        '**/*.d.ts', // Excluye las definiciones de tipos
        '**/*.test.{ts,tsx}' // Excluye los archivos de pruebas en sí
      ]
    }
  }
});