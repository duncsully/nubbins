import { html, component } from 'haunted'
import { counter, doubled } from '../counter'
import { useDatum } from './useDatum'

const HauntedComponent = () => {
  const [count, setCount] = useDatum(counter)
  const [double] = useDatum(doubled)

  const handleChange = (e: Event) =>
    setCount((e?.target as HTMLInputElement).valueAsNumber)

  return html`
    <section>
      <h2>Haunted</h2>
      <input type="number" .value=${count} @change=${handleChange} />
      <p>Doubled: ${double}</p>
    </section>
  `
}

export const setupHaunted = (componentName: string) =>
  customElements.define(componentName, component(HauntedComponent))
