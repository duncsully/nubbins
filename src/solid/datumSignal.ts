import { Datum } from '../core'
import { from } from 'solid-js'

export const datumSignal = <T>(datum: Datum<T>) => {
  const signal = from(datum)
  return [signal, datum.set] as const
}
