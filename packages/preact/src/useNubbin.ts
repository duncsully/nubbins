import { useEffect, useReducer } from 'preact/hooks'
import { useNubbinReturn } from 'nubbins-common'
import { ComputedNubbin, Nubbin } from 'nubbins'

export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const [, rerender] = useReducer(state => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return (
    'set' in nubbin
      ? ([nubbin.get(), nubbin.set] as const)
      : ([nubbin.get()] as const)
  ) as useNubbinReturn<T>
}
