import type { APIRoute } from 'astro'
import yaml from 'js-yaml'
import { fetchContent } from '../../../api/index.js'
import type { Schema } from '../../../schemas/index.js'
import { MaybeType } from '../../../utils/maybe.js'

function asMarkdown(content: Schema) {
    return `---
${yaml.dump(content)}
---

`
}

export const get: APIRoute = async ({ params }) => {
    const { schema, id } = params

    if (!schema) {
        return new Response(`"schema" is required`, { status: 400 })
    }

    if (!id) {
        return new Response(`"identifier" is required`, { status: 400 })
    }

    try {
        const content = await fetchContent(
            schema as Schema['@type'],
            id.toString()
        )

        return content.type === MaybeType.Nothing
            ? new Response('404 not found', { status: 404 })
            : new Response(asMarkdown(content.value), {
                  headers: { 'Content-Type': 'text/markdown' }
              })
    } catch (err: any) {
        return new Response(err, { status: 500 })
    }
}
