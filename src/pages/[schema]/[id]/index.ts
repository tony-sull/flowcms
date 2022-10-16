import type { APIRoute } from 'astro'
import { get as jsonld } from './index.jsonld.js'
import { get as md } from './index.md.js'

function parseAccept(request: Request) {
    return (request.headers.get('Accept') || '')
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean)
}

function asScript(content: string) {
    return `<script type="application/ld+json">
${content}
</script>`
}

export const get: APIRoute = async (context) => {
    const accept = parseAccept(context.request)

    if (accept.includes('text/markdown')) {
        return await md(context)
    }

    const res = (await jsonld(context)) as Response

    if (res.status !== 200) {
        return res
    }

    if (
        accept.includes('application/json') ||
        accept.includes('application/ld+json')
    ) {
        return res
    }

    const content = await res.text()

    return new Response(asScript(content), {
        headers: { 'Content-Type': 'text/html' }
    })
}
