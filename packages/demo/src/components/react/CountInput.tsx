import React from 'react'
import { useNubbin } from '@nubbins/react'
import { counter } from '../../counter'

export const CountInput = () => {
  const [count, setCount] = useNubbin(counter)

  return (
    <input
      type="number"
      value={count}
      onChange={e => setCount(e.currentTarget.valueAsNumber)}
    />
  )
}
