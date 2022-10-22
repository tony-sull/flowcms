import { z } from 'zod'
import * as Base from './creativework.js'
import { zc } from '../utils/zod.js'

function createSchema() {
    return Base.schema.extend({
        '@type': z.literal('Publication'),
        '@graph':
            z.array(zc.relation('Article'))
            .describe('List of articles in the series or publication.')
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
