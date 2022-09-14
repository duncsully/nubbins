import { counter, doubled } from '../counter'
import { datumSignal } from './datumSignal'
import html from 'solid-js/html'

export const SolidComponent = () => {
  const [count, setCount] = datumSignal(counter)
  const [double] = datumSignal(doubled)

  return html` <section>
    <h2>Solid</h2>
    <input
      type="number"
      value=${count}
      onInput=${(e: Event) =>
        setCount((e.currentTarget as HTMLInputElement).valueAsNumber)}
    />
    <p>Doubled: ${double}</p>
  </section>`
}
