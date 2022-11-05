import type { APIRoute } from 'astro'
import yaml from 'js-yaml'
import { fetchOne } from '../../../api/index.js'
import type { Schema } from '../../../schemas/index.js'
import { MaybeType } from '../../../utils/maybe.js'

function asMarkdown(content: Schema) {
    const { articleBody = '', ...frontmatter } = content as any

    return `---
${yaml.dump(frontmatter)}---

${articleBody}`
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
        const content = await fetchOne(schema as Schema['@type'], id.toString())

        return content.type === MaybeType.Nothing
            ? new Response('404 not found', { status: 404 })
            : new Response(asMarkdown(content.value), {
                  headers: { 'Content-Type': 'text/markdown' }
              })
    } catch (err: any) {
        return new Response(err, { status: 500 })
    }
}
