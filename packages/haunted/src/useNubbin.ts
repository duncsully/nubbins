import { useEffect, useReducer } from 'haunted'
import { useNubbinReturn } from 'nubbins-common'
import { Nubbin, ComputedNubbin } from '@nubbins/core'

export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const [, rerender] = useReducer((state: number) => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return (
    'set' in nubbin ? [nubbin.get(), nubbin.set] : [nubbin.get()]
  ) as useNubbinReturn<T>
}
