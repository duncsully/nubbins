import { ComputedNubbin, Nubbin } from '../../core/src'

export type useNubbinReturn<T> = T extends Nubbin<infer K>
  ? [K, Nubbin<K>['set']]
  : T extends ComputedNubbin<infer K>
  ? [K]
  : never
