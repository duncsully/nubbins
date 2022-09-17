import { Datum } from '../core'
import { effect, useSignal } from '@preact/signals'
import { useCallback, useEffect } from 'preact/hooks'

export const useDatumSignal = <T>(datum: Datum<T>) => {
  const signal = useSignal(datum.get())
  const updateSignal = useCallback((value: T) => (signal.value = value), [])

  useEffect(() => {
    const dispose = effect(() => {
      // Would get stuck in an infinite update loop otherwise
      datum.unsubscribe(updateSignal)
      datum.set(signal.value)
      datum.observe(updateSignal)
    })
    return () => {
      dispose()
      datum.unsubscribe(updateSignal)
    }
  }, [datum])

  return signal
}
