import * as Person from './person.js'
import * as Thing from './thing.js'

export type Schema =
    | Thing.Thing
    | Person.Person

export function parserForType<T extends Schema>(type: T['@type']) {
    switch (type) {
        case 'Person':
            return Person.parse
        case 'Thing':
            return Thing.parse
        default:
            throw new Error(`[parserForType] "${type}" type not found!`)
    }
}

export function stringify<T extends Schema>(thing: T) {
    switch (thing['@type']) {
        case 'Person':
            return Person.stringify(thing)
        case 'Thing':
            return Thing.stringify(thing)
        default:
            throw new Error(`[stringify] "${thing['@type']}" not found!`)
    }
}
