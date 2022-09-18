import { nullish, notEqual } from '../../utils'
import { Subscriber } from './Subscriber'

// TODO: Automatically batch updates without Nubbin.action? Would probably have to be a static option
// I could see reasons for both
// TODO: Better type inference: no set method + value setter if getter without setter passed?
// TODO: Track first value? Reset option?

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
    // TODO: Make setter an option? I think take out the option entirely, require extending
    // the base class when using Nubbins to access external data e.g. localStorage
    private setter?: (newValue: T) => void,
    private _options: {
      hasChanged?(currentValue: T | undefined, newValue: T): boolean
    } = {}
  ) {
    if (valueOrGetter instanceof Function) {
      this.getter = valueOrGetter

      // Need to compute the initial value to build the dependency graph
      this.getLatestValue()
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
    if (this._stale) {
      this.getLatestValue()
    }
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
    // It's possible we have new dependencies that weren't tracked previously
    // due to no subscriptions prompting the value to be recomputed
    // This subscriber needs to be updated if those new dependencies get updated
    if (this._stale) {
      this.getLatestValue()
    }
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

  protected _value!: T

  protected _stale = true

  protected getter?: () => T

  protected _dependents = new Set<Nubbin<any>>()

  protected _subscribers = new Set<Subscriber<T>>()

  /**
   *
   * @param previousValueTop
   * @returns
   */
  protected getAllUpdates = (previousValueTop?: T) => {
    const { hasChanged = notEqual } = this._options
    const allSubscribers: (() => void)[] = []

    if (this._subscribers.size) {
      const oldValue = this.getter ? this._value : previousValueTop
      this.getLatestValue()
      if (hasChanged(oldValue, this._value)) {
        this._subscribers.forEach(subscriber =>
          allSubscribers.push(() => subscriber(this._value))
        )
      }
    } else {
      this._stale = true
    }

    this._dependents.forEach(dependent => {
      allSubscribers.push(...dependent.getAllUpdates())
    })

    return allSubscribers
  }

  protected updateSubscribers(previousValueTop?: T) {
    const updates = this.getAllUpdates(previousValueTop)
    updates.forEach(update => update())
  }

  protected getLatestValue() {
    if (this.getter) {
      Nubbin.context.push(this)
      this._value = this.getter()
      this._stale = false
      Nubbin.context.pop()
    }
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
