import { z } from 'zod'
import * as Base from './creativework.js'

function createSchema() {
    return Base.schema.extend({
        '@type': z.literal('BlogPosting'),
        articleBody: z
            .string()
            .min(1)
            .optional()
            .describe('The actual body of the article.'),
        wordCount: z
            .number()
            .min(1)
            .optional()
            .describe('The number of words in the text of the article.')
    })
}

export const schema = createSchema()

export type Schema = z.infer<typeof schema>

export function parse(thing: unknown) {
    return schema.parseAsync(thing)
}

export function stringify(thing: Schema) {
    return JSON.stringify(thing, null, 2)
}
