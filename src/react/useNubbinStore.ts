import { useEffect, useMemo, useReducer } from 'react'
import { NubbinStore } from '../core/nubbinStore/nubbinStore'
import { nubbinStoreProxy } from '../core/nubbinStore/nubbinStoreProxy'

export const useNubbinStore = <T>(nubbinStore: NubbinStore<T>) => {
  const [, rerender] = useReducer(x => x + 1, 0)

  const [proxy, unsubscribe] = useMemo(
    () => nubbinStoreProxy(nubbinStore, rerender),
    [nubbinStore]
  )

  useEffect(() => unsubscribe, [proxy, unsubscribe])

  return proxy
}
