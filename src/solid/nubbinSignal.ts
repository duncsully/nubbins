import { ComputedNubbin, Nubbin } from '../core'
import { from } from 'solid-js'

export const nubbinSignal = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  const signal = from(nubbin)
  return (
    nubbin instanceof Nubbin ? [signal, nubbin.set] : [signal]
  ) as T extends Nubbin<infer K>
    ? [Nubbin<K>['get'], Nubbin<K>['set']]
    : T extends ComputedNubbin<infer K>
    ? [Nubbin<K>['get']]
    : never
}
