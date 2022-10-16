import type { MarkdownInstance } from 'astro'
import yaml from 'js-yaml'
import { parserForType } from '../schemas/index.js'
import type { Schema } from '../schemas/index.js'
import { Just, MaybeType, Nothing } from '../utils/maybe.js'
import type { Maybe } from '../utils/maybe.js'

const mdCache = import.meta.glob<MarkdownInstance<any>>('/content/*/*.md')
const yamlCache = import.meta.glob<string>('/content/**/*.yaml', { as: 'raw' })

async function fetchMarkdown<T extends Schema>(type: T['@type'], slug: string) {
    const key = `/content/${type}/${slug}.md`

    if (!(key in mdCache)) {
        return Nothing()
    }

    const md = await mdCache[key]()

    const articleBody = md.rawContent().trim()
    const wordCount = articleBody.split(' ').length

    return {
        ...md.frontmatter,
        articleBody,
        wordCount
    }
}

async function fetchYaml<T extends Schema>(type: T['@type'], slug: string) {
    const key = `/content/${type}/${slug}.yaml`

    if (!(key in yamlCache)) {
        return Nothing()
    }

    const rawYaml = await yamlCache[key]()
    const frontmatter = yaml.load(rawYaml)

    if (!frontmatter) {
        return Nothing()
    }

    return frontmatter
}

export async function fetchContent<T extends Schema>(type: T['@type'], slug: string): Promise<Maybe<T>> {
    let rawContent = await fetchMarkdown(type, slug)

    if (rawContent.type === MaybeType.Nothing) {
        console.log('trying yaml')
        rawContent = await fetchYaml(type, slug)
    }

    const parser = parserForType(type)

    return Just(await parser({
        ...rawContent,
        '@type': type,
        identifier: new URL(`/${type}/${slug}`, import.meta.env.SITE).toString(),
        url: new URL(`/${type}/${slug}`, import.meta.env.SITE).toString(),
    }) as T)
}
