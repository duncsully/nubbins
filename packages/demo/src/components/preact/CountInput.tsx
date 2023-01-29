/** @jsxImportSource preact */
import { counter } from '../../counter'
import { useNubbinSignal } from '@nubbins/preact'

export const CountInput = () => {
  const count = useNubbinSignal(counter)

  const handleChange = (e: Event) =>
    (count.value = (e?.currentTarget as HTMLInputElement).valueAsNumber)

  return <input type="number" value={count} onInput={handleChange} />
}
