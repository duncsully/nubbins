import { useEffect, useReducer } from 'haunted'
import { Nubbin } from '../core'

export const useNubbin = <T>(nubbin: Nubbin<T>) => {
  const [, rerender] = useReducer((state: number) => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return [nubbin.get(), nubbin.set] as const
}
