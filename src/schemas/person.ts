import { z } from 'zod'
import * as Base from './thing.js'

const validator = Base.validator.extend({
    '@type': z.literal('Person'),
    email: z.string()
        .email()
        .optional()
        .describe('Email address'),
    familyName: z.string()
        .optional()
        .describe('Family name. In the U.S., the last name of a Person.'),
    givenName: z.string()
        .optional()
        .describe('Given name. In the U.S., the first name of a Person. ')
})

export type Person = z.infer<typeof validator>

export function parse(thing: unknown) {
    return validator.parse(thing)
}

export function stringify(thing: Person) {
    return JSON.stringify(thing, null, 2)
}
