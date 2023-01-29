import { useSyncExternalStore } from 'react'
import { useNubbinReturn } from 'nubbins-common'
import { ComputedNubbin, Nubbin } from '@nubbins/core'

export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const state = useSyncExternalStore(nubbin.observe, nubbin.get)

  return (
    'set' in nubbin ? ([state, nubbin.set] as const) : ([state] as const)
  ) as useNubbinReturn<T>
}
