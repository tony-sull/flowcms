import { z } from 'zod'
import * as Base from './creativework.js'

export const validator = Base.validator.extend({
    '@type': z.literal('BlogPosting'),
    articleBody: z.string()
        .min(1)
        .describe('The actual body of the article.'),
    wordCount: z.number()
        .min(1)
        .describe('The number of words in the text of the article.')
})

export type BlogPosting = z.infer<typeof validator>

export function parse(thing: unknown) {
    return validator.parseAsync(thing)
}

export function stringify(thing: BlogPosting) {
    return JSON.stringify(thing, null, 2)
}
