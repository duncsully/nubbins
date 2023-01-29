import React from 'react'
import { doubled } from '../../counter'
import { useNubbin } from '@nubbins/react'

export const Doubled = () => {
  const [double] = useNubbin(doubled)

  return <p>Doubled: {double}</p>
}
