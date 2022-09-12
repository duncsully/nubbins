import { Datum } from '../Datum/Datum'
import { Subscriber } from '../Datum/Subscriber'
import { DatumStore } from './datumStore'

// TODO: Continue testing this. Is this useful?
export const datumStoreProxy = <T>(
  datumStore: DatumStore<T>,
  subscriber?: Subscriber<any>
) => {
  const unsubscribe = () => {
    if (subscriber) {
      Object.values<Datum<any>>(datumStore).forEach(datum =>
        datum.unsubscribe(subscriber)
      )
    }
  }
  const subscribed = new Set<keyof T>()
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        const key = prop as keyof DatumStore<T>
        const datum = datumStore[key]
        if (subscriber && !subscribed.has(key)) {
          datum.observe(subscriber)
          subscribed.add(key)
        }
        return datum.get()
      },
      set(_, key, newValue) {
        datumStore[key as keyof DatumStore<T>].set(newValue)
        return true
      },
    }
  ) as {
    [K in keyof T]: T[K] extends (...args: any[]) => any
      ? ReturnType<T[K]>
      : T[K]
  }

  return [proxy, unsubscribe] as const
}
