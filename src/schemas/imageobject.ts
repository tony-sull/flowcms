import { z } from 'zod'
import * as Base from './mediaobject.js'

export const validator = Base.validator.extend({
    '@type': z.literal('ImageObject'),
    caption: z.string()
        .describe('The caption for this image.'),
    height: z.number()
        .min(1)
        .optional()
        .describe('The height of the item.'),
    width: z.number()
        .min(1)
        .optional()
        .describe('The width of the item.')
})

export type ImageObject = z.infer<typeof validator>

export function parse(thing: unknown) {
    return validator.parseAsync(thing)
}

export function stringify(thing: ImageObject) {
    return JSON.stringify(thing, null, 2)
}
