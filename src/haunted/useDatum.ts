import { useEffect, useReducer } from 'haunted'
import { Datum } from '../datum'

export const useDatum = <T>(datum: Datum<T>) => {
  const [, rerender] = useReducer((state: number) => state + 1, 0)

  useEffect(() => datum.subscribe(rerender), [datum])

  return [datum.get(), datum.set] as const
}
