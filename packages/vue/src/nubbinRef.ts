import { ComputedNubbin, Nubbin } from '@nubbins/core'
import { customRef, Ref } from 'vue'

export const nubbinRef = <T extends Nubbin<any> | ComputedNubbin<any>>(
  nubbin: T
) => {
  return customRef((track, trigger) => {
    nubbin.subscribe(trigger)
    return {
      get() {
        track()
        return nubbin.get()
      },
      set(newValue) {
        if (nubbin instanceof Nubbin) {
          nubbin.set(newValue)
          trigger()
        }
      },
    }
  }) as T extends Nubbin<infer V>
    ? Ref<V>
    : T extends ComputedNubbin<infer V>
    ? { readonly value: V }
    : never
}
