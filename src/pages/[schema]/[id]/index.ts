import type { APIRoute } from 'astro'
import { get as jsonld } from './index.jsonld.js'

export const get: APIRoute = async (context) => {
    const res = await jsonld(context) as Response

    if (res.status !== 200) {
        return res
    }

    const accept = (context.request.headers.get('Accept') || '')
        .split(',')
        .map(a => a.trim())
        .filter(Boolean)
    
    if (accept.includes('application/json') || accept.includes('application/ld+json')) {
        return res
    }

    const content = await res.json()

    return new Response(`<script type="application/ld+json">
${JSON.stringify(content, null, 2)}
</script>`)
}