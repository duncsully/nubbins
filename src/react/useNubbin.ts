import { useSyncExternalStore } from 'react'
import { Nubbin } from '../core'

// TODO: Support older React versions without useSyncExternalStore? Use shim?
export const useNubbin = <T>(nubbin: Nubbin<T>) => {
  const state = useSyncExternalStore(nubbin.observe, nubbin.get)

  return [state, nubbin.set] as const
}
