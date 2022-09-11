import { /* useReducer, useEffect, */ useSyncExternalStore } from 'react'
import { Datum } from '../datum/'

/* export const useDatum = <T>(datum: Datum<T>) => {
  const [, rerender] = useReducer(x => x + 1, 0)

  useEffect(() => datum.subscribe(rerender), [datum])

  return [datum.get(), datum.set] as const
} */

export const useDatum = <T>(datum: Datum<T>) => {
  const state = useSyncExternalStore(datum.observe, datum.get)

  return [state, datum.set] as const
}
