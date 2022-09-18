import { notEqual } from '../../utils'
import { NubbinOptions } from './NubbinOptions'
import { Subscriber } from './Subscriber'

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
    action()
    if (flush) {
      Nubbin.batchedUpdateChecks?.forEach(nubbin => nubbin.updateSubscribers())
      Nubbin.batchedUpdateChecks = undefined
    }
  }

  constructor(
    valueOrGetter: T | (() => T),
    private _options: NubbinOptions<T> = {}
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
    if (this.getter) {
      console.warn('Attempted setting readonly nubbin:', this)
      return
    }

    const currentValue = this._value
    const newValue = value instanceof Function ? value(currentValue) : value
    this._value = newValue

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

  /**
   * Accessor and setter allow for extending this class in case value comes from
   * external source, e.g. search params
   */
  protected get _value() {
    return this._internalValue
  }
  protected set _value(newValue) {
    this._internalValue = newValue
  }

  protected _internalValue!: T

  protected _stale = true

  protected getter?: () => T

  protected _dependents = new Set<Nubbin<any>>()

  protected _subscribers = new Set<Subscriber<T>>()

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

export const nubbin = (...args: ConstructorParameters<typeof Nubbin>) =>
  new Nubbin(...args)
