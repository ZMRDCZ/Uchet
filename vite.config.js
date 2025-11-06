import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const normalizeBase = (value) => {
  if (!value) {
    return '/'
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return '/'
  }

  const withLeadingSlash = trimmed.startsWith('/')
    ? trimmed
    : `/${trimmed}`

  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash
    : `${withLeadingSlash}/`
}

const resolveBasePath = () => {
  if (process.env.BASE_PATH) {
    return normalizeBase(process.env.BASE_PATH)
  }

  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''

  if (process.env.GITHUB_ACTIONS && repository) {
    if (repository.endsWith('.github.io')) {
      return '/'
    }

    return normalizeBase(repository)
  }

  return '/'
}

const base = resolveBasePath()

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'axios'],
          ui: ['bootstrap', '@popperjs/core'],
          charts: ['chart.js', 'vue-chartjs']
        }
      }
    }
  }
})