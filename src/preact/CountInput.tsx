import { html } from 'htm/preact'
import { counter } from '../counter'
import { useNubbinSignal } from './useNubbinSignal'

export const CountInput = () => {
  const count = useNubbinSignal(counter)

  const handleChange = (e: Event) =>
    (count.value = (e?.currentTarget as HTMLInputElement).valueAsNumber)

  return html`<input type="number" value=${count} onInput=${handleChange} />`
}
