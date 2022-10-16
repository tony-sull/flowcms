import { z } from 'zod'
import * as Base from './thing.js'
import { relation } from './zod.js'
import { fetchContent } from '../api/index.js'
import { Maybe, MaybeType } from '../utils/maybe.js'
import type { Person } from './person.js'

function safeDate(value?: string | Date) {
    if (!value) { return undefined }

    try {
        return new Date(value)
    } catch {
        return undefined
    }
}

export const validator = Base.validator.extend({
    '@type': z.literal('CreativeWork'),
    abstract: z.string()
        .optional()
        .describe('An abstract is a short description that summarizes a CreativeWork.'),
    author: relation<Person>('Person')
        .describe('The author of this content or rating.'),
    dateCreated: z.date()
        .optional()
        .describe('The date on which the CreativeWork was created or the item was added to a DataFeed.'),
    dateModified: z.date()
        .optional()
        .describe('The date on which the CreativeWork was most recently modified.'),
    datePublished: z.date()
        .or(
            z.string()
            .transform(safeDate)
        )
        .optional()
        .describe('Date of first broadcast/publication.'),
    encodingType: z.string()
        .optional() // TODO validate mime type
        .describe('Media type typically expressed using a MIME format'),
    headline: z.string()
        .optional()
        .describe('Headline of the article.'),
    keywords: z.array(z.string())
        .optional()
        .describe('Keywords or tags used to describe some item.'),
    text: z.string()
        .optional()
        .describe('The textual content of this CreativeWork.')
})

export type CreativeWork = z.infer<typeof validator>

export function parse(thing: unknown) {
    return validator.parseAsync(thing)
}

export function stringify(thing: CreativeWork) {
    return JSON.stringify(thing, null, 2)
}
