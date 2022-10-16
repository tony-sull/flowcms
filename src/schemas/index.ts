import * as BlogPosting from './blogposting.js'
import * as ImageObject from './imageobject.js'
import * as Person from './person.js'
import * as Thing from './thing.js'

export type Schema =
    | BlogPosting.Schema
    | ImageObject.Schema
    | Person.Schema
    | Thing.Schema

export function schemaForType<T extends Schema>(type: T['@type']) {
    switch (type) {
        case 'BlogPosting':
            return BlogPosting.schema
        case 'ImageObject':
            return ImageObject.schema
        case 'Person':
            return Person.schema
        case 'Thing':
            return Thing.schema
        default:
            throw new Error(`[schemaForType] "${type}" type not found!`)
    }
}

export function parserForType<T extends Schema>(type: T['@type']) {
    switch (type) {
        case 'BlogPosting':
            return BlogPosting.parse
        case 'ImageObject':
            return ImageObject.parse
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
        case 'BlogPosting':
            return BlogPosting.stringify(thing)
        case 'ImageObject':
            return ImageObject.stringify(thing)
        case 'Person':
            return Person.stringify(thing)
        case 'Thing':
            return Thing.stringify(thing)
        default:
            throw new Error(`[stringify] "${thing['@type']}" not found!`)
    }
}
