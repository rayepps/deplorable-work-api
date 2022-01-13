import type { TokenAuth } from '@exobase/auth'

export * from './model/types'
export * from './graphcms/types'

export type PlatformTokenAuth = TokenAuth<{
  platformId: string
  username: string
}>