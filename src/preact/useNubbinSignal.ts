import { Nubbin } from '../core'
import { effect, useSignal } from '@preact/signals'
import { useCallback, useEffect } from 'preact/hooks'

export const useNubbinSignal = <T>(nubbin: Nubbin<T>) => {
  const signal = useSignal(nubbin.get())
  const updateSignal = useCallback((value: T) => (signal.value = value), [])

  useEffect(() => {
    const dispose = effect(() => {
      // Would get stuck in an infinite update loop otherwise
      nubbin.unsubscribe(updateSignal)
      nubbin.set(signal.value)
      nubbin.observe(updateSignal)
    })
    return () => {
      dispose()
      nubbin.unsubscribe(updateSignal)
    }
  }, [nubbin])

  return signal
}
