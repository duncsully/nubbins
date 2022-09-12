import { datumStore } from './datumStore'

describe('datumStore', () => {
  it('creates an object of datums', () => {
    const { count, doubled, quadrupled } = datumStore({
      count: 1,
      doubled: () => count.get() * 2,
      quadrupled: () => doubled.get() * 2,
    })

    expect(quadrupled.get()).toBe(4)

    count.set(2)

    expect(quadrupled.get()).toBe(8)
  })
})
