import { useEffect, useReducer } from 'haunted'
import { useNubbinReturn } from '../common'
import { Nubbin, ComputedNubbin } from '../core'

export const useNubbin = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const [, rerender] = useReducer((state: number) => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return (
    nubbin instanceof Nubbin ? [nubbin.get(), nubbin.set] : [nubbin.get()]
  ) as useNubbinReturn<T>
}
