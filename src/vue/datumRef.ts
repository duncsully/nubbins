import { Datum } from '../core'
import { customRef } from 'vue'

export const datumRef = <T>(datum: Datum<T>) => {
  return customRef((track, trigger) => {
    datum.subscribe(trigger)
    return {
      get() {
        track()
        return datum.get()
      },
      set(newValue) {
        datum.set(newValue)
        trigger()
      },
    }
  })
}
