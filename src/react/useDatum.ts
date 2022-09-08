import { useReducer, useEffect } from 'react'
import { Datum } from '../datum/'

export const useDatum = <T>(datum: Datum<T>) => {
  const [, rerender] = useReducer(x => x + 1, 0)

  useEffect(() => datum.subscribe(rerender), [datum])

  return [datum.get(), datum.set] as const
}
