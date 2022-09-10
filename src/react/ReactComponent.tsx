import React from 'react'
import { counter, doubled } from '../counter'
import { useDatum } from './useDatum'

export const ReactComponent = () => {
  const [count, setCount] = useDatum(counter)
  const [double] = useDatum(doubled)
  return (
    <section>
      <h2>React</h2>
      <input
        type="number"
        value={count}
        onChange={e => setCount(e.target.valueAsNumber)}
      />
      <p>Doubled: {double}</p>
    </section>
  )
}
