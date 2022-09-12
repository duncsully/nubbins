import { useEffect, useMemo, useReducer } from 'react'
import { DatumStore } from '../core/datumStore/datumStore'
import { datumStoreProxy } from '../core/datumStore/datumStoreProxy'

export const useDatumStore = <T>(datumStore: DatumStore<T>) => {
  const [, rerender] = useReducer(x => x + 1, 0)

  const [proxy, unsubscribe] = useMemo(
    () => datumStoreProxy(datumStore, rerender),
    [datumStore]
  )

  useEffect(() => unsubscribe, [proxy, unsubscribe])

  return proxy
}
