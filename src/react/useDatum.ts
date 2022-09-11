import { useSyncExternalStore } from 'react'
import { Datum } from '../datum/'

// TODO: Support older React versions without useSyncExternalStore? Use shim?
export const useDatum = <T>(datum: Datum<T>) => {
  const state = useSyncExternalStore(datum.observe, datum.get)

  return [state, datum.set] as const
}
