import { html, virtual } from 'haunted'
import { counter } from '../../counter'
import { useDatum } from '../useDatum'

export const CountInput = virtual(() => {
  const [count, setCount] = useDatum(counter)

  const handleChange = (e: Event) =>
    setCount((e?.currentTarget as HTMLInputElement).valueAsNumber)

  return html`<input type="number" .value=${count} @input=${handleChange} />`
})
