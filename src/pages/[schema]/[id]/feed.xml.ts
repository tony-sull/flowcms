import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { fetchOne } from '../../../api/index.js'
import type { Schema } from '../../../schemas/index.js'
import type { Schema as ImageObject } from '../../../schemas/imageobject.js'
import type { Schema as Publication } from '../../../schemas/publication.js'
import { MaybeType } from '../../../utils/maybe.js'

function stringifyCustomData(data: Record<string, unknown>) {
    return Object.entries(data)
        .filter(([key, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join('')
}

export const get: APIRoute = async ({ params, request }) => {
    const { schema, id } = params

    if (!schema) {
        return new Response(`"schema" is required`, { status: 400 })
    }

    if (!id) {
        return new Response(`"identifier" is required`, { status: 400 })
    }

    if (schema !== 'Publication') {
        return new Response('404 not found', { status: 404 })
    }

    try {
        const content = await fetchOne(schema as Schema['@type'], id.toString())

        if (content.type === MaybeType.Nothing) {
            return new Response('404 not found', { status: 404 })
        }

        const publication = content.value as Publication

        const [pubDate] = publication['@graph']
            .map(
                ({ datePublished, dateModified }) =>
                    dateModified || datePublished
            )
            .filter((date) => !!date)
            .sort((a, b) => b!.getDate() - a!.getDate())

        return rss({
            title: publication.name,
            description: publication.description,
            site: import.meta.env.SITE,
            items: publication['@graph']
                .filter(({ datePublished }) => !!datePublished)
                .map((article) => ({
                    link: article.url,
                    title: article.name,
                    pubDate: article.datePublished!,
                    customData: stringifyCustomData({
                        author: article.author?.email,
                        guid: article.identifier
                    })
                })),
            customData: stringifyCustomData({
                pubDate: pubDate?.toUTCString(),
                copywright: `© ${new Date().getFullYear()}. All rights reserved.`,
                generator: 'Flow CMS',
                image: (publication.image as ImageObject | undefined)
                    ?.contentUrl,
                lastBuildDate: new Date().toUTCString(),
                link: new URL(
                    new URL(request.url).pathname,
                    import.meta.env.SITE
                )
            })
        })
    } catch (err: any) {
        return new Response(err, { status: 500 })
    }
}
