import { nullish, notEqual } from '../../utils'
import { Subscriber } from './Subscriber'

// TODO: Automatically batch updates without Nubbin.action? Would probably have to be a static option
// I could see reasons for both
// TODO: Better type inference: no set method + value setter if getter without setter passed?
// TODO: Track first value? Reset option?
// TODO: Lazy getter until gotten/subscribed?

/**
 * An atomic state piece that allows subscribing to changes and tracks
 * dependent Nubbins
 */
export class Nubbin<T> {
  static context: Nubbin<any>[] = []
  static batchedUpdateChecks: undefined | Set<Nubbin<any>>
  /**
   * All subscription updates will be deferred until after passed action has run,
   * preventing a subscriber from being updated multiple times for multiple
   * nubbin write operations
   * @param action
   */
  static action(action: () => void) {
    // If there is already a set, this is a nested call, don't flush until we
    // return to the top level
    const flush = !Nubbin.batchedUpdateChecks
    Nubbin.batchedUpdateChecks ??= new Set()
    // TODO: forward return value?
    action()
    if (flush) {
      Nubbin.batchedUpdateChecks?.forEach(nubbin => nubbin.updateSubscribers())
      Nubbin.batchedUpdateChecks = undefined
    }
  }

  constructor(
    valueOrGetter: T | (() => T),
    // TODO: Make setter an option?
    private setter?: (newValue: T) => void,
    private _options: {
      hasChanged?(currentValue: T | undefined, newValue: T): boolean
    } = {}
  ) {
    if (valueOrGetter instanceof Function) {
      this.getter = valueOrGetter
      Nubbin.context.push(this)
      this._value = valueOrGetter()
      Nubbin.context.pop()
    } else {
      this._value = valueOrGetter
    }
  }

  get value() {
    return this.get()
  }
  set value(newValue) {
    this.set(newValue)
  }

  get = () => {
    const caller = Nubbin.context.at(-1)
    if (caller) this._dependents.add(caller)
    return this._value
  }

  set = (value: T | ((currentValue: T) => T)) => {
    if (this.getter && !this.setter) {
      console.warn('No setter was defined for Nubbin with getter', this)
      return
    }

    const currentValue = this._value
    const newValue = value instanceof Function ? value(currentValue) : value

    if (this.setter) {
      this.setter(newValue)
    } else {
      this._value = newValue
    }
    if (!Nubbin.batchedUpdateChecks) {
      this.updateSubscribers(currentValue)
    } else {
      Nubbin.batchedUpdateChecks.add(this)
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
    subscriber(this._value)
    return this.observe(subscriber)
  }

  unsubscribe = (updateHandler: Subscriber<T>) => {
    this._subscribers.delete(updateHandler)
  }

  protected _value: T

  protected getter?: () => T

  protected _dependents = new Set<Nubbin<any>>()

  protected _subscribers = new Set<Subscriber<T>>()

  // TODO: A bit messy, could this be cleaned up?
  // The idea is that a leaf node will always be a primitive value, so we
  // need to pass in the previous value to compare. But dependents will always need to
  // recalculate their values
  protected getAllUpdates = (...args: [T?]) => {
    const [previousValueTop] = args
    const { hasChanged = notEqual } = this._options
    const allSubscribers: (() => void)[] = []
    // This allows us to know if undefined was explicitly passed
    const oldValue = args.length ? previousValueTop : this._value
    if (!args.length) {
      // Dependents will always be computed
      this._value = this.getter!()
    }

    if (hasChanged(oldValue, this._value)) {
      this._subscribers.forEach(subscriber =>
        allSubscribers.push(() => subscriber(this._value))
      )
      this._dependents.forEach(dependent => {
        allSubscribers.push(...dependent.getAllUpdates())
      })
    }

    return allSubscribers
  }

  protected updateSubscribers(previousValueTop?: T) {
    const updates = this.getAllUpdates(previousValueTop)
    updates.forEach(update => update())
  }
}

// TODO: Move
export const persistedNubbin = <T>(key: string, defaultValue: T) =>
  new Nubbin(
    () => {
      const existingValue = localStorage.getItem(key)
      return existingValue ? JSON.parse(existingValue) : defaultValue
    },
    newValue => localStorage.setItem(key, JSON.stringify(newValue))
  )

const searchParams = new URLSearchParams(window.location.search)
export const searchNubbin = <T>(key: string, defaultValue: T) =>
  new Nubbin(
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

export const firstNameNubbin = persistedNubbin('firstName', 'Jenkins')
export const lastNameNubbin = searchNubbin('lastName', 'Sullivan')
export const fullNameNubbin = new Nubbin(() =>
  `${firstNameNubbin.get()} ${lastNameNubbin.get()}`.trim()
)
