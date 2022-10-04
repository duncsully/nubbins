import { counter } from 'nubbins-common'
import { useNubbin } from '../useNubbin'

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
