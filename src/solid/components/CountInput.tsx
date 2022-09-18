import { counter } from '../../counter'
import { nubbinSignal } from '../nubbinSignal'
import html from 'solid-js/html'

export const CountInput = () => {
  const [count, setCount] = nubbinSignal(counter)

  return html`
    <input
      type="number"
      value=${count}
      onInput=${(e: Event) =>
        setCount((e.currentTarget as HTMLInputElement).valueAsNumber)}
    />
  `
}
