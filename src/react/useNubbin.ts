import { useSyncExternalStore } from 'react'
import { useNubbinReturn } from '../common'
import { ComputedNubbin, Nubbin } from '../core'

// TODO: Support older React versions without useSyncExternalStore? Use shim?
export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const state = useSyncExternalStore(nubbin.observe, nubbin.get)

  return (
    nubbin instanceof Nubbin
      ? ([state, nubbin.set] as const)
      : ([state] as const)
  ) as useNubbinReturn<T>
}
