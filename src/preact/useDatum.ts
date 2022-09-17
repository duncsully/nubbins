import { useEffect, useReducer } from 'preact/hooks'
import { Datum } from '../core'

export const useDatum = <T>(datum: Datum<T>) => {
  const [, rerender] = useReducer(state => state + 1, 0)

  useEffect(() => datum.observe(rerender), [datum])

  return [datum.get(), datum.set] as const
}
