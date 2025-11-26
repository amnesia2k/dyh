import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
// import netlify from '@netlify/vite-plugin-tanstack-start'
import { nitro } from 'nitro/vite'

// const isDocker = process.env.IN_DOCKER === '1'
// const isCI = process.env.CI === 'true' // IMPORTANT FIX

export default defineConfig({
  plugins: [
    devtools(),

    // disable Netlify plugin on CI + Docker
    // !isDocker && !isCI && netlify(),

    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ].filter(Boolean),
})
