import { Nubbin } from '../core'
import { customRef } from 'vue'

export const nubbinRef = <T>(nubbin: Nubbin<T>) => {
  return customRef((track, trigger) => {
    nubbin.subscribe(trigger)
    return {
      get() {
        track()
        return nubbin.get()
      },
      set(newValue) {
        nubbin.set(newValue)
        trigger()
      },
    }
  })
}
