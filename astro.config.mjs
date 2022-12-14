import { defineConfig } from 'astro/config'
import netlify from '@astrojs/netlify/edge-functions'

// https://astro.build/config
export default defineConfig({
    site: 'https://api.navillus.dev',
    output: 'server',
    adapter: netlify()
})
