import { html } from 'htm/preact'
import { counter } from '../counter'
import { useDatumSignal } from './useDatumSignal'

export const CountInput = () => {
  const count = useDatumSignal(counter)

  const handleChange = (e: Event) =>
    (count.value = (e?.currentTarget as HTMLInputElement).valueAsNumber)

  return html`<input type="number" value=${count} onInput=${handleChange} />`
}
