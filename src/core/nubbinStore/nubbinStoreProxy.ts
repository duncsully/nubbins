import { Nubbin } from '../Nubbin/Nubbin'
import { Subscriber } from '../Nubbin/Subscriber'
import { NubbinStore } from './nubbinStore'

// TODO: Continue testing this. Is this useful?
export const nubbinStoreProxy = <T>(
  nubbinStore: NubbinStore<T>,
  subscriber?: Subscriber<any>
) => {
  const unsubscribe = () => {
    if (subscriber) {
      Object.values(nubbinStore).forEach(nubbin =>
        (nubbin as Nubbin<any>).unsubscribe(subscriber)
      )
    }
  }
  const subscribed = new Set<keyof T>()
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        const key = prop as keyof NubbinStore<T>
        const nubbin = nubbinStore[key]
        if (subscriber && !subscribed.has(key)) {
          nubbin.observe(subscriber)
          subscribed.add(key)
        }
        return nubbin.get()
      },
      set(_, key, newValue) {
        const targetNubbin = nubbinStore[key as keyof NubbinStore<T>]
        if (targetNubbin instanceof Nubbin) {
          targetNubbin.set(newValue)
        }
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
