import { nubbinStore } from './nubbinStore'

describe('nubbinStore', () => {
  it('creates an object of nubbins', () => {
    const { count, doubled, quadrupled } = nubbinStore({
      count: 1,
      doubled: () => count.get() * 2,
      quadrupled: () => doubled.get() * 2,
    })

    expect(quadrupled.get()).toBe(4)

    count.set(2)

    expect(quadrupled.get()).toBe(8)
  })
})
