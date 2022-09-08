import { Datum } from './Datum'

describe('Datum', () => {
  describe('.get()', () => {
    it('returns the primitive value passed to the constructor', () => {
      const datum = new Datum(1)

      expect(datum.get()).toBe(1)
    })
  })
})
