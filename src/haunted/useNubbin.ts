import { useEffect, useReducer } from 'haunted'
import { useNubbinReturn } from '../../packages/common/src'
import { Nubbin, ComputedNubbin } from '../../packages/core/src'

export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const [, rerender] = useReducer((state: number) => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return (
    nubbin instanceof Nubbin ? [nubbin.get(), nubbin.set] : [nubbin.get()]
  ) as useNubbinReturn<T>
}
