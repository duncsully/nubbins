import React from 'react'
import { counter } from '../../counter'
import { useDatum } from '../useDatum'

export const CountInput = () => {
  const [count, setCount] = useDatum(counter)

  return (
    <input
      type="number"
      value={count}
      onChange={e => setCount(e.currentTarget.valueAsNumber)}
    />
  )
}
