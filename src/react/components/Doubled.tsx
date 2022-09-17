import React from 'react'
import { doubled } from '../../counter'
import { useDatum } from '../useDatum'

export const Doubled = () => {
  const [double] = useDatum(doubled)

  return <p>Doubled: {double}</p>
}
