import type { MarkdownInstance } from 'astro'
import { parserForType } from '../schemas/index.js'
import type { Schema } from '../schemas/index.js'
import { Just, Nothing } from '../utils/maybe.js'
import type { Maybe } from '../utils/maybe.js'

const cache = import.meta.glob<MarkdownInstance<any>>('/content/*/*.md')

export async function fetchContent<T extends Schema>(schema: T['@type'], slug: string): Promise<Maybe<T>> {
    const key = `/content/${schema}/${slug}.md`

    if (!(key in cache)) {
        return Nothing()
    }

    const md = await cache[key]()

    const rawContent = {
        ...md.frontmatter,
        '@type': schema,
        identifier: new URL(`/${schema}/${slug}`, import.meta.env.SITE).toString(),
        url: new URL(`/${schema}/${slug}`, import.meta.env.SITE).toString()
    }

    const parser = parserForType(schema)

    return Just(parser(rawContent) as T)
}
