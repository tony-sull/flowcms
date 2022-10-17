import type { APIRoute } from 'astro'
import { fetchOne } from '../../../api/index.js'
import type { Schema } from '../../../schemas/index.js'
import { MaybeType } from '../../../utils/maybe.js'
import { ldToString } from '../../../components/schema.js'

export const get: APIRoute = async ({ params }): Promise<Response> => {
    const { schema, id } = params

    if (!schema) {
        return new Response(`"schema" is required`, { status: 400 })
    }

    if (!id) {
        return new Response(`"identifier" is required`, { status: 400 })
    }

    try {
        const content = await fetchOne(
            schema as Schema['@type'],
            id.toString()
        )

        return content.type === MaybeType.Nothing
            ? new Response('404 not found', { status: 404 })
            : new Response(ldToString(content.value as any), {
                  headers: { 'Content-Type': 'application/ld+json' }
              })
    } catch (err: any) {
        return new Response(err, { status: 500 })
    }
}
