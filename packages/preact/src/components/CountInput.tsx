import { counter } from 'nubbins-common'
import { useNubbinSignal } from '../useNubbinSignal'

export const CountInput = () => {
  const count = useNubbinSignal(counter)

  const handleChange = (e: Event) =>
    (count.value = (e?.currentTarget as HTMLInputElement).valueAsNumber)

  // TODO: Should be able to pass a signal in directly, but it'll type error
  return <input type="number" value={count.value} onInput={handleChange} />
}
