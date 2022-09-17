import { nullish, notEqual } from '../../utils'
import { Subscriber } from './Subscriber'

// TODO: Automatically batch updates without Datum.action?
// TODO: Better type inference: no set method + value setter if getter without setter passed?
// TODO: Track first value? Reset option?

/**
 * An atomic state piece that allows subscribing to changes and tracks
 * dependent Datums
 */
export class Datum<T> {
  static context: Datum<any>[] = []
  static batchedUpdateChecks: undefined | Set<Datum<any>>
  /**
   * All subscription updates will be deferred until after passed action has run,
   * preventing a subscriber from being updated multiple times for multiple
   * datum write operations
   * @param action
   */
  static action(action: () => void) {
    // If there is already a set, this is a nested call, don't flush until we
    // return to the top level
    const flush = !Datum.batchedUpdateChecks
    Datum.batchedUpdateChecks ??= new Set()
    // TODO: forward return value?
    action()
    if (flush) {
      Datum.batchedUpdateChecks?.forEach(datum => datum.updateSubscribers())
      Datum.batchedUpdateChecks = undefined
    }
  }

  constructor(
    protected _value: T | (() => T),
    // TODO: Make setter an option?
    private setter?: (newValue: T) => void,
    private _options: {
      hasChanged?(currentValue: T | undefined, newValue: T): boolean
    } = {}
  ) {
    this._lastValueBroadcasted = _value instanceof Function ? _value() : _value
    this.registerDependencies()
  }

  get value() {
    return this.get()
  }
  set value(newValue) {
    this.set(newValue)
  }

  // TODO: Memoize? - Use lastValueBroadcasted if subscribers?
  get = () => {
    const caller = Datum.context.at(-1)
    if (caller) this._dependents.add(caller)
    return this.getValue()
  }

  set = (value: T | ((currentValue: T) => T)) => {
    if (this._value instanceof Function && !this.setter) {
      console.warn('No setter was defined for Datum with getter', this)
      return
    }
    const currentValue = this.getValue()

    const newValue = value instanceof Function ? value(currentValue) : value

    if (this.setter) {
      this.setter(newValue)
    } else {
      this._value = newValue
    }
    if (!Datum.batchedUpdateChecks) {
      this.updateSubscribers()
    } else {
      Datum.batchedUpdateChecks.add(this)
    }
  }

  /**
   * Observes for changes without immediately calling subscriber with current value
   * @param subscriber
   * @returns
   */
  observe = (subscriber: Subscriber<T>) => {
    this._subscribers.add(subscriber)
    return () => this.unsubscribe(subscriber)
  }

  /**
   * Observes for changes and immediately calls subscriber with current value
   * @param subscriber
   * @returns
   */
  subscribe = (subscriber: Subscriber<T>) => {
    const value = this.getValue()
    subscriber(value)
    this._lastValueBroadcasted = value
    return this.observe(subscriber)
  }

  unsubscribe = (updateHandler: Subscriber<T>) => {
    this._subscribers.delete(updateHandler)
  }

  protected _dependents = new Set<Datum<any>>()

  protected _subscribers = new Set<Subscriber<T>>()

  protected _lastValueBroadcasted: T | undefined

  protected getAllUpdates = () => {
    const { hasChanged = notEqual } = this._options
    const allSubscribers: (() => void)[] = []
    const value = this.getValue()

    if (hasChanged(this._lastValueBroadcasted, value)) {
      this._subscribers.forEach(subscriber =>
        allSubscribers.push(() => subscriber(value))
      )
      this._dependents.forEach(dependent => {
        allSubscribers.push(...dependent.getAllUpdates())
      })
      this._lastValueBroadcasted = value
    }

    return allSubscribers
  }

  protected updateSubscribers() {
    const updates = this.getAllUpdates()
    updates.forEach(update => update())
  }

  protected registerDependencies() {
    if (this._value instanceof Function) {
      Datum.context.push(this)
      this._value()
      Datum.context.pop()
    }
  }

  protected getValue() {
    return this._value instanceof Function ? this._value() : this._value
  }
}

// TODO: Move
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
