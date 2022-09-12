import { Datum } from '../Datum/Datum'

export type DatumStore<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? Datum<ReturnType<T[K]>>
    : Datum<T[K]>
}

/**
 * A convenience function for creating an object of datums from an object
 * of values. Note: doesn't allow passing setters.
 * @param obj
 * @returns
 */
export const datumStore = <T extends object>(obj: T) => {
  const result = {}
  const common = {
    configurable: true,
    enumerable: true,
  }
  Object.entries(obj).forEach(([key, value]) => {
    // Lazily evaluated because datums that depend on other datums
    // will need to wait for the object to be created before
    // they can be initialized.
    Object.defineProperty(result, key, {
      ...common,
      get() {
        const datum = new Datum(value)
        Object.defineProperty(result, key, {
          value: datum,
          ...common,
        })
        return datum
      },
    })
  })

  return result as DatumStore<T>
}
