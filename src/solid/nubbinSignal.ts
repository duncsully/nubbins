import { Nubbin } from '../core'
import { from } from 'solid-js'

export const nubbinSignal = <T>(nubbin: Nubbin<T>) => {
  const signal = from(nubbin)
  return [signal, nubbin.set] as const
}
