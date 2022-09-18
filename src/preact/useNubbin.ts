import { useEffect, useReducer } from 'preact/hooks'
import { Nubbin } from '../core'

export const useNubbin = <T>(nubbin: Nubbin<T>) => {
  const [, rerender] = useReducer(state => state + 1, 0)

  useEffect(() => nubbin.observe(rerender), [nubbin])

  return [nubbin.get(), nubbin.set] as const
}
