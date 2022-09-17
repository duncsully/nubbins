import { html, component } from 'haunted'
import { CountInput } from './CountInput'
import { Doubled } from './Doubled'

const HauntedComponent = () => {
  return html`
    <section>
      <h2>Haunted</h2>
      ${CountInput()} ${Doubled()}
    </section>
  `
}

export const setupHaunted = (componentName: string) =>
  customElements.define(componentName, component(HauntedComponent))
