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

      jest.spyOn(console, 'warn').mockImplementation(() => null)
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

  describe('observe + set', () => {
    it('calls all callbacks provided to subscribe method if value changed', () => {
      const datum = new Datum(1)

      const subscriber1 = jest.fn()
      datum.observe(subscriber1)
      const subscriber2 = jest.fn()
      datum.observe(subscriber2)
      datum.set(2)

      expect(subscriber1).toHaveBeenCalledWith(2)
      expect(subscriber2).toHaveBeenCalledWith(2)
    })

    it('does not call all callbacks if value did not change', () => {
      const datum = new Datum(1)

      const subscriber = jest.fn()
      datum.observe(subscriber)
      datum.set(1)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('observe + get + set', () => {
    it('updates subscribers for datum dependent on other datum', () => {
      const datum = new Datum(1)
      const squared = new Datum(() => datum.get() ** 2)
      const cubed = new Datum(() => datum.get() ** 3)

      const subscriber = jest.fn()
      squared.observe(subscriber)
      cubed.observe(subscriber)
      datum.set(2)

      expect(subscriber).toHaveBeenCalledTimes(2)
      expect(subscriber).toHaveBeenNthCalledWith(1, 4)
      expect(subscriber).toHaveBeenNthCalledWith(2, 8)
    })

    it('does not update if dependent datum does not change value', () => {
      const datum = new Datum(1.1)
      const flooredDatum = new Datum(() => Math.floor(datum.get()))
      const doubledFlooredDatum = new Datum(() => flooredDatum.get() * 2)

      const flooredSubscriber = jest.fn()
      flooredDatum.observe(flooredSubscriber)
      const doubledFlooredSubscriber = jest.fn()
      doubledFlooredDatum.observe(doubledFlooredSubscriber)
      datum.set(1.2)

      expect(flooredSubscriber).not.toHaveBeenCalled()
      expect(doubledFlooredSubscriber).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribe', () => {
    it('removes passed callback from subscriptions', () => {
      const datum = new Datum(1)

      const subscriber = jest.fn()
      datum.observe(subscriber)
      datum.unsubscribe(subscriber)
      datum.set(2)

      expect(subscriber).not.toHaveBeenCalled()
    })

    it('is also returned by observe method', () => {
      const datum = new Datum(1)

      const subscriber = jest.fn()
      const unsubscribe = datum.observe(subscriber)
      unsubscribe()
      datum.set(2)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('subscribe', () => {
    it('calls subscriber immediately with current value', () => {
      const datum = new Datum(1)
      const subscriber1 = jest.fn()

      datum.subscribe(subscriber1)

      expect(subscriber1).toHaveBeenCalledWith(1)

      datum.set(2)
      const subscriber2 = jest.fn()
      datum.subscribe(subscriber2)

      expect(subscriber2).toHaveBeenCalledWith(2)
    })
  })

  describe('action', () => {
    it('defers subscription updates until after action finishes', () => {
      const datum1 = new Datum(1)
      const datum2 = new Datum('hi')
      const subscriber = jest.fn()
      datum1.observe(subscriber)
      datum2.observe(subscriber)

      Datum.action(() => {
        datum1.set(2)
        expect(subscriber).not.toHaveBeenCalled()
        datum2.set('yo')
      })

      expect(subscriber).toHaveBeenCalledTimes(2)
    })
  })

  it('will not update dependent datum if its value after all operations has not changed', () => {
    const widthDatum = new Datum(1)
    const heightDatum = new Datum(10)
    const areaDatum = new Datum(() => widthDatum.get() * heightDatum.get())
    const subscriber = jest.fn()
    areaDatum.observe(subscriber)

    Datum.action(() => {
      widthDatum.set(2)
      heightDatum.set(5)
    })

    expect(subscriber).not.toHaveBeenCalled()
  })
})
