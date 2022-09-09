import { Datum } from './Datum'

describe('Datum', () => {
  describe('get', () => {
    it('returns the primitive value passed to the constructor', () => {
      const datum = new Datum(1)

      expect(datum.get()).toBe(1)
    })

    it('returns return value of function passed to constructor', () => {
      const datum = new Datum(() => 'hi')

      expect(datum.get()).toBe('hi')
    })
  })

  describe('set', () => {
    it('sets a new primitive value', () => {
      const datum = new Datum(1)

      datum.set(2)

      expect(datum.get()).toBe(2)
    })

    it('sets a new primitive value returned by passed function', () => {
      const datum = new Datum(1)

      datum.set(value => ++value)

      expect(datum.get()).toBe(2)
    })

    it('logs warning if used on getter Datum without setter', () => {
      const datum = new Datum(() => 1)

      jest.spyOn(console, 'warn')
      datum.set(2)

      expect(console.warn).toHaveBeenCalled()
    })

    it('calls setter if passed to constructor', () => {
      const setter = jest.fn()
      const datum = new Datum(() => 1, setter)

      datum.set(2)

      expect(setter).toHaveBeenCalledWith(2)
    })
  })

  describe('subscribe + set', () => {
    it('calls all callbacks provided to subscribe method if value changed', () => {
      const datum = new Datum(1)

      const subscriber1 = jest.fn()
      datum.subscribe(subscriber1)
      const subscriber2 = jest.fn()
      datum.subscribe(subscriber2)
      datum.set(2)

      expect(subscriber1).toHaveBeenCalled()
      expect(subscriber2).toHaveBeenCalled()
    })

    it('does not call all callbacks if value did not change', () => {
      const datum = new Datum(1)

      const subscriber = jest.fn()
      datum.subscribe(subscriber)
      datum.set(1)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('subscribe + get + set', () => {
    it('updates subscribers for datum dependent on other datum (and only once per subscriber)', () => {
      const datum = new Datum(1)
      const squared = new Datum(() => datum.get() ^ 2)
      const cubed = new Datum(() => datum.get() ^ 3)

      const subscriber = jest.fn()
      squared.subscribe(subscriber)
      cubed.subscribe(subscriber)
      datum.set(2)

      expect(subscriber).toHaveBeenCalledTimes(1)
    })

    it('does not update if dependent datum does not change value', () => {
      const datum = new Datum(1.1)
      const flooredDatum = new Datum(() => Math.floor(datum.get()))
      const doubledFlooredDatum = new Datum(() => flooredDatum.get() * 2)

      const flooredSubscriber = jest.fn()
      flooredDatum.subscribe(flooredSubscriber)
      const doubledFlooredSubscriber = jest.fn()
      doubledFlooredDatum.subscribe(doubledFlooredSubscriber)
      datum.set(1.2)

      expect(flooredSubscriber).not.toHaveBeenCalled()
      expect(doubledFlooredSubscriber).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribe', () => {
    it('removes passed callback from subscriptions', () => {
      const datum = new Datum(1)

      const subscriber = jest.fn()
      datum.subscribe(subscriber)
      datum.unsubscribe(subscriber)
      datum.set(2)

      expect(subscriber).not.toHaveBeenCalled()
    })

    it('is also returned by subscribe method', () => {
      const datum = new Datum(1)

      const subscriber = jest.fn()
      const unsubscribe = datum.subscribe(subscriber)
      unsubscribe()
      datum.set(2)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })
})
