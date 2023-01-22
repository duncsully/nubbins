import { ComputedNubbin, Nubbin } from '../../packages/core/src'
import { effect, Signal, ReadonlySignal, useSignal } from '@preact/signals'
import { useCallback, useEffect } from 'preact/hooks'

export const useNubbinSignal = <T extends ComputedNubbin<any> | Nubbin<any>>(
  nubbin: T
) => {
  type Value = T['value']
  const writeable = nubbin instanceof Nubbin
  const signal = useSignal(nubbin.get())
  const updateSignal = useCallback((value: Value) => (signal.value = value), [])

  useEffect(() => {
    const dispose = effect(() => {
      // Would get stuck in an infinite update loop otherwise
      nubbin.unsubscribe(updateSignal)
      if (writeable) {
        nubbin.set(signal.value)
      }
      nubbin.observe(updateSignal)
    })
    return () => {
      dispose()
      nubbin.unsubscribe(updateSignal)
    }
  }, [nubbin])

  return signal as T extends Nubbin<infer R>
    ? Signal<R>
    : T extends ComputedNubbin<infer R>
    ? ReadonlySignal<R>
    : never
}
