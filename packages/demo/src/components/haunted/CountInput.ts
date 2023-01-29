import { html, virtual } from 'haunted'
import { counter } from '../../counter'
import { useNubbin } from '@nubbins/haunted'

export const CountInput = virtual(() => {
  const [count, setCount] = useNubbin(counter)

  const handleChange = (e: Event) =>
    setCount((e?.currentTarget as HTMLInputElement).valueAsNumber)

  return html`<input type="number" .value=${count} @input=${handleChange} />`
})
