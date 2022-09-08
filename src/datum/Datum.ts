import { nullish } from '../utils'

type Subscriber = () => void

/**
 * An atomic state piece that allows subscribing to changes and tracks
 * dependent Datums
 */
export class Datum<T> {
  static context: Datum<any>[] = []

  constructor(
    protected _value: T | (() => T),
    private setter?: (newValue: T) => void
  ) {}

  // TODO: Memoize?
  get = () => {
    const caller = Datum.context.at(-1)
    if (caller) this._dependents.add(caller)
    if (this._value instanceof Function) {
      Datum.context.push(this)
      const value = this._value()
      Datum.context.pop()
      return value
    }
    return this._value
  }

  set = (value: T | ((currentValue: T) => T)) => {
    if (this._value instanceof Function && !this.setter) {
      console.warn('No setter was defined for Datum with getter', this)
      return
    }
    const currentValue = this.get()

    const newValue = value instanceof Function ? value(currentValue) : value

    if (this.setter) {
      this.setter(newValue)
    } else {
      this._value = newValue
    }
    if (currentValue !== newValue) this.updateSubscribers()
  }

  subscribe = (subscriber: Subscriber) => {
    this._subscribers.add(subscriber)
    return () => this.unsubscribe(subscriber)
  }

  unsubscribe = (updateHandler: Subscriber) => {
    this._subscribers.delete(updateHandler)
  }

  protected _dependents = new Set<Datum<any>>()

  protected _subscribers = new Set<Subscriber>()

  protected getAllSubscribers = () => {
    const allSubscribers = [...this._subscribers]
    this._dependents.forEach(dependent =>
      allSubscribers.push(...dependent.getAllSubscribers())
    )
    return new Set(allSubscribers)
  }

  protected updateSubscribers() {
    const allSubscribers = this.getAllSubscribers()
    allSubscribers.forEach(subscriber => subscriber())
  }
}

export const persistedDatum = <T>(key: string, defaultValue: T) =>
  new Datum(
    () => {
      const existingValue = localStorage.getItem(key)
      return existingValue ? JSON.parse(existingValue) : defaultValue
    },
    newValue => localStorage.setItem(key, JSON.stringify(newValue))
  )

const searchParams = new URLSearchParams(window.location.search)
export const searchDatum = <T>(key: string, defaultValue: T) =>
  new Datum(
    () => {
      const existingValue = searchParams.get(key)
      return existingValue ? JSON.parse(existingValue) : defaultValue
    },
    newValue => {
      if (!nullish(newValue)) searchParams.set(key, JSON.stringify(newValue))
      else searchParams.delete(key)
      const { origin, pathname } = window.location
      window.history.pushState({}, '', `${origin}${pathname}?${searchParams}`)
    }
  )

export const firstNameDatum = persistedDatum('firstName', 'Jenkins')
export const lastNameDatum = searchDatum('lastName', 'Sullivan')
export const fullNameDatum = new Datum(() =>
  `${firstNameDatum.get()} ${lastNameDatum.get()}`.trim()
)

/* const paramData = new WeakMap()

const paramDatum = () => {
  const datum: Datum<string> = new Datum(() => paramData.get(datum))
  return datum
}

const path =
  (strings: TemplateStringsArray, ...data: Datum<any>[]) =>
  () => {
    // TODO: Should /path/ and /path be different?
    const paramMatcher = '([^/]+)'
    const regex =
      '^' +
      strings.join(paramMatcher) +
      (data.length === strings.length ? paramMatcher : '') +
      '$'
    const result = window.location.pathname.match(new RegExp(regex))
    if (result) {
      data.forEach((datum, i) => {
        paramData.set(datum, result[i + 1])
      })
      return true
    }
    return false
  }

const exampleParamDatum = paramDatum()

const testPath = path`/test/${exampleParamDatum}`

console.log(testPath(), exampleParamDatum.get())

interface RouteDef<T> {
  params: T
  match: (params: T) => boolean
  getPath: (params: T) => string
  goTo: (params: Record<keyof T, any>) => boolean
}

const getRouteDef = <T extends object>(
  params: T,
  pathTemplate: (params: T) => ReturnType<typeof path>
): RouteDef<T> => ({
  params,
  match: params => false,
  getPath: params => '',
  goTo: params => false,
})

const testRoute = getRouteDef(
  { exampleParamDatum },
  ({ exampleParamDatum }) => path`/path/${exampleParamDatum}`
)

const goTo = <T>(route: RouteDef<T>, params: T) => false

testRoute.goTo({ exampleParamDatum: 'yes' }) */
