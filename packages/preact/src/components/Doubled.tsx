import { doubled } from '../../../common/src/counter'
import { useNubbinSignal } from '../useNubbinSignal'

export const Doubled = () => {
  const double = useNubbinSignal(doubled)

  return <p>Doubled: {double}</p>
}
