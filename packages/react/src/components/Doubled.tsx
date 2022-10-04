import { doubled } from 'nubbins-common'
import { useNubbin } from '../useNubbin'

export const Doubled = () => {
  const [double] = useNubbin(doubled)

  return <p>Doubled: {double}</p>
}
