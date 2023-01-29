/** @jsxImportSource preact */
import { doubled } from '../../counter'
import { useNubbin } from '@nubbins/preact'

export const Doubled = () => {
  const [double] = useNubbin(doubled)

  return <p>Doubled: {double}</p>
}
