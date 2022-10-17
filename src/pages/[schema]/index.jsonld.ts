import type { APIRoute } from 'astro'
import { fetchAll } from '../../api/index.js'
import type { Schema } from '../../schemas/index.js'
import { ldToString } from '../../components/schema.js'

export const get: APIRoute = async ({ params }): Promise<Response> => {
    const { schema } = params

    if (!schema) {
        return new Response(`"schema" is required`, { status: 400 })
    }

    try {
        const content = await fetchAll(
            schema as Schema['@type']
        )

        return new Response(ldToString(content as any, 2), {
            headers: { 'Content-Type': 'application/ld+json' }
        })
    } catch (err: any) {
        return new Response(err, { status: 500 })
    }
}
