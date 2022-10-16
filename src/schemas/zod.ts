import { z } from 'zod'
import type { Schema } from './index.js'
import { fetchContent } from '../api'
import { Maybe, MaybeType } from '../utils/maybe'

export function relation<T>(type: string): z.ZodEffects<z.ZodString, T | undefined> {
    return z.string()
            .transform(async (slug: string) => {
                const maybeContent: Maybe<T> = await fetchContent<T>(type as any, slug)

                return maybeContent.type === MaybeType.Just
                    ? maybeContent.value
                    : undefined
            })
}