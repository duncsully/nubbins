import { notEqual } from '../utils'
import { NubbinOptions } from './NubbinOptions'
import { Subscriber } from './Subscriber'

// TODO: Implement valueOf? Would technically allow direct use of number nubbins (numbins?) without .get() or .value

/**
 * An atomic state piece that allows subscribing to changes and tracks
 * dependent Nubbins
 */
export class ComputedNubbin<T> {
  static context: ComputedNubbin<any>[] = []
  static batchedUpdateChecks: undefined | Set<ComputedNubbin<any>>
  /**
   * All subscription updates will be deferred until after passed action has run,
   * preventing a subscriber from being updated multiple times for multiple
   * nubbin write operations
   * @param action
   */
  static action(action: () => void) {
    // If there is already a set, this is a nested call, don't flush until we
    // return to the top level
    const flush = !ComputedNubbin.batchedUpdateChecks
    ComputedNubbin.batchedUpdateChecks ??= new Set()
    action()
    if (flush) {
      ComputedNubbin.batchedUpdateChecks?.forEach(nubbin =>
        nubbin.updateSubscribers()
      )
      ComputedNubbin.batchedUpdateChecks = undefined
    }
  }

  constructor(
    protected getter?: () => T,
    private _options: NubbinOptions<T> = {}
  ) {
    // Need to compute the initial value to build the dependency graph
    this.getLatestValue()
  }

  get value() {
    return this.get()
  }

  get = () => {
    const caller = ComputedNubbin.context.at(-1)
    if (caller) this._dependents.add(caller)
    if (this._stale) {
      this.getLatestValue()
    }
    return this._value
  }

  /**
   * Observes for changes without immediately calling subscriber with current value
   * @param subscriber
   * @returns Unsubscribe function
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
   * @returns Unsubscribe function
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

  protected _dependents = new Set<ComputedNubbin<any>>()

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
      ComputedNubbin.context.push(this)
      this._value = this.getter()
      this._stale = false
      ComputedNubbin.context.pop()
    }
  }
}

export class Nubbin<T> extends ComputedNubbin<T> {
  constructor(value: T, options?: NubbinOptions<T>) {
    super(undefined, options)
    this._internalValue = value
  }

  set = (value: T | ((currentValue: T) => T)) => {
    const currentValue = this._value
    const newValue = value instanceof Function ? value(currentValue) : value
    this._value = newValue

    if (!ComputedNubbin.batchedUpdateChecks) {
      this.updateSubscribers(currentValue)
    } else {
      ComputedNubbin.batchedUpdateChecks.add(this)
      // Mark all dependents as stale so they will be recomputed if they are
      // read during the action
      this._dependents.forEach(nubbin => {
        // @ts-ignore
        nubbin._stale = true
      })
    }
  }

  get value() {
    return super.value
  }
  set value(newValue: T) {
    this.set(newValue)
  }
}

type InferNubbin<T> = T extends () => infer V ? ComputedNubbin<V> : Nubbin<T>

export const nubbin = <T, Value = T extends () => infer V ? V : T>(
  valueOrGetter: T,
  options?: NubbinOptions<Value>
) => {
  return (
    valueOrGetter instanceof Function
      ? new ComputedNubbin(valueOrGetter as () => Value, options)
      : new Nubbin(valueOrGetter, options as unknown as NubbinOptions<T>)
  ) as InferNubbin<T>
}

export const action = ComputedNubbin.action
