import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://ixarrfemifocuxzgwlic.supabase.co',
    'sb_publishable_41QqqRokaW8MocBAfre83A_RKzlpkm1'
  )
}