import { z } from 'zod'
import * as Base from './thing.js'
import { zc } from '../utils/zod.js'

export const validator = Base.validator.extend({
    '@type': z.literal('MediaObject'),
    contentSize: z.string()
        .describe('File size in kilobytes (kB).'),
    contentUrl: z.string()
        .url()
        .describe('Actual bytes of the media object, for example the image file or video file.'),
    height: z.number()
        .min(1)
        .optional()
        .describe('The height of the item.'),
    uploadDate: zc.safeDate()
        .optional()
        .describe('Date when this media object was uploaded to this site.'),
    width: z.number()
        .min(1)
        .optional()
        .describe('The width of the item.')
})

export type MediaObject = z.infer<typeof validator>

export function parse(thing: unknown) {
    return validator.parseAsync(thing)
}

export function stringify(thing: MediaObject) {
    return JSON.stringify(thing, null, 2)
}
