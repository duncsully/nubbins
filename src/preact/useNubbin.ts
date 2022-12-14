import { useEffect, useReducer } from 'preact/hooks'
import { useNubbinReturn } from '../common'
import { ComputedNubbin, Nubbin } from '../core'

export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const [, rerender] = useReducer(state => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return (
    nubbin instanceof Nubbin
      ? ([nubbin.get(), nubbin.set] as const)
      : ([nubbin.get()] as const)
  ) as useNubbinReturn<T>
}
