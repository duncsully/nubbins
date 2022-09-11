import { useEffect, useReducer } from 'haunted'
import { Datum } from '../core'

export const useDatum = <T>(datum: Datum<T>) => {
  const [, rerender] = useReducer((state: number) => state + 1, 0)

  useEffect(() => datum.observe(rerender), [datum])

  return [datum.get(), datum.set] as const
}
