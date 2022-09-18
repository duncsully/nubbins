import { Nubbin } from '../Nubbin/Nubbin'

export type NubbinStore<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? Nubbin<ReturnType<T[K]>>
    : Nubbin<T[K]>
}

/**
 * A convenience function for creating an object of nubbins from an object
 * of values. Note: doesn't allow passing setters.
 * @param obj
 * @returns
 */
export const nubbinStore = <T extends object>(obj: T) => {
  const result = {}
  const common = {
    configurable: true,
    enumerable: true,
  }
  Object.entries(obj).forEach(([key, value]) => {
    // Lazily evaluated because nubbins that depend on other nubbins
    // will need to wait for the object to be created before
    // they can be initialized.
    Object.defineProperty(result, key, {
      ...common,
      get() {
        const nubbin = new Nubbin(value)
        Object.defineProperty(result, key, {
          value: nubbin,
          ...common,
        })
        return nubbin
      },
    })
  })

  return result as NubbinStore<T>
}
