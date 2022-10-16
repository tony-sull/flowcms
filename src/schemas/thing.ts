import { z } from 'zod'

export const validator = z.object({
    '@context': z.string()
        .url()
        .default('http://schema.org/'),
    '@type': z.literal('Thing')
        .describe('Schema identifier type.'),
    description: z.string()
        .min(1)
        .optional()
        .describe('A description of the item.'),
    identifier: z.string()
        .url()
        .describe('The identifier property represents any kind of identifier for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc.'),
    image: z.string()
        .url()
        .optional()
        .describe('An image of the item'),
    name: z.string()
        .min(1)
        .describe('The name of the item'),
    sameAs: z.string()
        .url()
        .optional()
        .describe("URL of a reference Web page that unambiguously indicates the item's identity"),
    url: z.string()
        .url()
        .describe('URL of the item')
})

export type Thing = z.infer<typeof validator>

export function parse(thing: unknown) {
    return validator.parseAsync(thing)
}

export function stringify(thing: Thing) {
    return JSON.stringify(thing, null, 2)
}
