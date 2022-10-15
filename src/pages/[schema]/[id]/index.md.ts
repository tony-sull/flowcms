import type { APIRoute } from 'astro'
import yaml from 'js-yaml'
import { fetchContent } from '../../../api/index.js'
import type { Schema } from '../../../schemas/index.js'
import { MaybeType } from '../../../utils/maybe.js'

export const get: APIRoute = async ({ params }) => {
    const { schema, id } = params

    if (!schema) {
        return new Response(`"schema" is required`, { status: 400 })
    }
    
    if (!id) {
        return new Response(`"identifier" is required`, { status: 400 })
    }

    try {
        const content = await fetchContent(schema as Schema['@type'], id.toString())

        if (content.type === MaybeType.Nothing) {
            return new Response('404 not found', { status: 404 })
        }
        
        const md = `---
${yaml.dump(content.value)}
---

`
        
        return new Response(md, { headers: { 'Content-Type': 'text/markdown' }})
    } catch (err: any) {
        return new Response(err, { status: 500 })
    }
}