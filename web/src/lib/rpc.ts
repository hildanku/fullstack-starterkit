import { hc } from 'hono/client'
import type { AppType } from '@/root/src/main'
import { BASE_URL } from '@/lib/constant'

export const client = hc<AppType>(BASE_URL)
