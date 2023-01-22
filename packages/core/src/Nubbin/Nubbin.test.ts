import { ComputedNubbin, nubbin, Nubbin } from './Nubbin'
import { describe, it, expect, vi } from 'vitest'

// TODO: More complete tests / better organization? The class split results in mostly
// the same functionality that is more easily tested with a writeable nubbin

describe('ComputedNubbin', () => {
  describe('get', () => {
    it('returns return value of function passed to constructor', () => {
      const nubbin = new ComputedNubbin(() => 'hi')

      expect(nubbin.get()).toBe('hi')
    })
  })

  describe('reactivity', () => {
    it('calls subscribers when dependencies change', () => {
      const nubbin = new Nubbin(1)
      const squared = new ComputedNubbin(() => nubbin.get() ** 2)
      const cubed = new ComputedNubbin(() => nubbin.get() ** 3)

      const subscriber = vi.fn()
      squared.observe(subscriber)
      cubed.observe(subscriber)
      nubbin.set(2)

      expect(subscriber).toHaveBeenCalledTimes(2)
      expect(subscriber).toHaveBeenNthCalledWith(1, 4)
      expect(subscriber).toHaveBeenNthCalledWith(2, 8)
    })

    it('does not recompute data until dependencies change (i.e. is memoized)', () => {
      const nubbin = new Nubbin(['a', 'b', 'c'])
      const getterCheck = vi.fn()
      const sortedNubbin = new ComputedNubbin(() => {
        getterCheck()
        return [...nubbin.get()].sort()
      })
      getterCheck.mockClear()

      sortedNubbin.get()

      expect(getterCheck).not.toHaveBeenCalled()

      sortedNubbin.subscribe(vi.fn())

      expect(getterCheck).not.toHaveBeenCalled()

      nubbin.set([])

      expect(getterCheck).toHaveBeenCalled()
    })

    it('does not update if recomputed value still the same after dependencies change', () => {
      const nubbin = new Nubbin(1.1)
      const flooredNubbin = new ComputedNubbin(() => Math.floor(nubbin.get()))
      const doubledFlooredNubbin = new ComputedNubbin(
        () => flooredNubbin.get() * 2
      )

      const flooredSubscriber = vi.fn()
      flooredNubbin.observe(flooredSubscriber)
      const doubledFlooredSubscriber = vi.fn()
      doubledFlooredNubbin.observe(doubledFlooredSubscriber)
      nubbin.set(1.2)

      expect(flooredSubscriber).not.toHaveBeenCalled()
      expect(doubledFlooredSubscriber).not.toHaveBeenCalled()
    })

    it('lazily evaluates getters', () => {
      const nubbin = new Nubbin(['a', 'b', 'c'])
      const getterCheck = vi.fn()
      const sortedNubbin = new ComputedNubbin(() => {
        getterCheck()
        return [...nubbin.get()].sort()
      })
      getterCheck.mockClear()

      nubbin.set([])

      expect(getterCheck).not.toHaveBeenCalled()

      sortedNubbin.get()

      expect(getterCheck).toHaveBeenCalled()

      getterCheck.mockClear()

      nubbin.set(['hi'])

      expect(getterCheck).not.toHaveBeenCalled()

      sortedNubbin.subscribe(vi.fn())

      expect(getterCheck).toHaveBeenCalled()
    })

    it(`works with getters that do not call all dependencies (i.e. conditionals) even 
    if subscribing after conditional would expose new dependencies`, () => {
      const nubbin = new Nubbin(1)
      const laterNubbin = new Nubbin(2)
      const computedNubbin = new ComputedNubbin(() => {
        if (nubbin.get() > 2) {
          return laterNubbin.get()
        }
        return 0
      })

      nubbin.set(3)
      const subscriber = vi.fn()
      computedNubbin.observe(subscriber)
      laterNubbin.set(5)

      expect(subscriber).toHaveBeenCalled()
    })
  })
})

describe('Nubbin', () => {
  describe('get', () => {
    it('returns the primitive value passed to the constructor', () => {
      const nubbin = new Nubbin(1)

      expect(nubbin.get()).toBe(1)
    })
  })

  describe('set', () => {
    it('sets a new primitive value', () => {
      const nubbin = new Nubbin(1)

      nubbin.set(2)

      expect(nubbin.get()).toBe(2)
    })

    it('sets a new primitive value returned by passed function', () => {
      const nubbin = new Nubbin(1)

      nubbin.set(value => ++value)

      expect(nubbin.get()).toBe(2)
    })
  })

  describe('value', () => {
    it('works like .get() when read', () => {
      const nubbin = new Nubbin(5)

      expect(nubbin.value).toBe(5)
    })

    it('works like .set() when set', () => {
      const nubbin = new Nubbin(true)

      nubbin.value = false

      expect(nubbin.value).toBe(false)
    })
  })

  describe('observe + set', () => {
    it('calls all callbacks provided to subscribe method if value changed', () => {
      const nubbin = new Nubbin(1)

      const subscriber1 = vi.fn()
      nubbin.observe(subscriber1)
      const subscriber2 = vi.fn()
      nubbin.observe(subscriber2)
      nubbin.set(2)

      expect(subscriber1).toHaveBeenCalledWith(2)
      expect(subscriber2).toHaveBeenCalledWith(2)
    })

    it('does not call all callbacks if value did not change (using default hasChanged)', () => {
      const nubbin = new Nubbin(1)

      const subscriber = vi.fn()
      nubbin.observe(subscriber)
      nubbin.set(1)

      expect(subscriber).not.toHaveBeenCalled()
    })

    it('can have change check configured with hasChanged option', () => {
      const nubbin = new Nubbin(['beans', 'chicken'], {
        hasChanged: (current, next) =>
          next.some((value, i) => current?.[i] !== value),
      })

      const subscriber = vi.fn()
      nubbin.observe(subscriber)
      nubbin.set(['beans', 'chicken'])

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('unsubscribe', () => {
    it('removes passed callback from subscriptions', () => {
      const nubbin = new Nubbin(1)

      const subscriber = vi.fn()
      nubbin.observe(subscriber)
      nubbin.unsubscribe(subscriber)
      nubbin.set(2)

      expect(subscriber).not.toHaveBeenCalled()
    })

    it('is also returned by observe method', () => {
      const nubbin = new Nubbin(1)

      const subscriber = vi.fn()
      const unsubscribe = nubbin.observe(subscriber)
      unsubscribe()
      nubbin.set(2)

      expect(subscriber).not.toHaveBeenCalled()
    })
  })

  describe('subscribe', () => {
    it('calls subscriber immediately with current value', () => {
      const nubbin = new Nubbin(1)
      const subscriber1 = vi.fn()

      nubbin.subscribe(subscriber1)

      expect(subscriber1).toHaveBeenCalledWith(1)

      nubbin.set(2)
      const subscriber2 = vi.fn()
      nubbin.subscribe(subscriber2)

      expect(subscriber2).toHaveBeenCalledWith(2)
    })
  })

  describe('action', () => {
    it('defers subscription updates until after all actions (nested included) finish', () => {
      const nubbin1 = new Nubbin(1)
      const nubbin2 = new Nubbin('hi')
      const subscriber = vi.fn()
      nubbin1.observe(subscriber)
      nubbin2.observe(subscriber)

      ComputedNubbin.action(() => {
        ComputedNubbin.action(() => {
          nubbin1.set(2)
          expect(subscriber).not.toHaveBeenCalled()
        })
        expect(subscriber).not.toHaveBeenCalled()
        nubbin2.set('yo')
      })

      expect(subscriber).toHaveBeenCalledTimes(2)
    })
  })

  it('will not update dependent nubbin if its value after all operations has not changed', () => {
    const widthNubbin = new Nubbin(1)
    const heightNubbin = new Nubbin(10)
    const areaNubbin = new ComputedNubbin(
      () => widthNubbin.get() * heightNubbin.get()
    )
    const subscriber = vi.fn()
    areaNubbin.observe(subscriber)

    ComputedNubbin.action(() => {
      widthNubbin.set(2)
      heightNubbin.set(5)
    })

    expect(subscriber).not.toHaveBeenCalled()
  })
})

describe('nubbin', () => {
  it('returns a ComputedNubbin if passed a function, else a Nubbin', () => {
    const nubbin1 = nubbin(1)
    const nubbin2 = nubbin(() => nubbin1.get() * 2)

    expect(nubbin1 instanceof Nubbin).toBeTruthy()
    expect(nubbin2 instanceof ComputedNubbin).toBeTruthy()
  })
})
