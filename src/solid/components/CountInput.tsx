import { counter } from '../../counter'
import { datumSignal } from '../datumSignal'
import html from 'solid-js/html'

export const CountInput = () => {
  const [count, setCount] = datumSignal(counter)

  return html`
    <input
      type="number"
      value=${count}
      onInput=${(e: Event) =>
        setCount((e.currentTarget as HTMLInputElement).valueAsNumber)}
    />
  `
}
