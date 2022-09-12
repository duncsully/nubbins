import { datumStore } from './datumStore'
import { datumStoreProxy } from './datumStoreProxy'

// A noop for reading values from a proxy
const read = (...args: any[]) => args

describe('datumStoreProxy', () => {
  it('creates proxy for getting and setting datumStore datums', () => {
    const store = datumStore({
      count: 1,
      doubled: () => store.count.get() * 2,
    })
    const [storeProxy] = datumStoreProxy(store)

    expect(storeProxy.count).toBe(1)
    expect(storeProxy.doubled).toBe(2)

    storeProxy.count = 2

    expect(storeProxy.count).toBe(2)
    expect(storeProxy.doubled).toBe(4)
  })

  it('allows passing subscriber that is only called for read properties', () => {
    const store = datumStore({
      count: 1,
      doubled: () => store.count.get() * 2,
      separate: 'hi',
    })
    const subscriber = jest.fn()
    const [storeProxy] = datumStoreProxy(store, subscriber)

    read(storeProxy.doubled)

    store.count.set(2)

    expect(subscriber).toHaveBeenCalledWith(4)

    subscriber.mockClear()
    store.separate.set('yo')

    expect(subscriber).not.toHaveBeenCalled()

    read(storeProxy.separate)

    store.separate.set('heya')

    expect(subscriber).toHaveBeenCalledWith('heya')
  })

  it('returns unsubscribe function', () => {
    const store = datumStore({
      count: 1,
      doubled: () => store.count.get() * 2,
    })
    const subscriber = jest.fn()
    const [storeProxy, unsubscribe] = datumStoreProxy(store, subscriber)

    read(storeProxy.count, storeProxy.doubled)
    unsubscribe()

    store.count.set(2)

    expect(subscriber).not.toHaveBeenCalled()
  })
})
