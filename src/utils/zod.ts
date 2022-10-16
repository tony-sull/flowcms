import { z } from 'zod'
import { fetchContent } from '../api'
import { Maybe, MaybeType } from '../utils/maybe'

function relation<T>(type: string): z.ZodEffects<z.ZodString, T | undefined> {
    return z.string()
            .transform(async (slug: string) => {
                const maybeContent: Maybe<T> = await fetchContent<T>(type as any, slug)

                return maybeContent.type === MaybeType.Just
                    ? maybeContent.value
                    : undefined
            })
}

function safeDate() {
    return z.date()
        .or(z.string().transform((value) => new Date(value)))
}

export const zc = {
    relation,
    safeDate
}
