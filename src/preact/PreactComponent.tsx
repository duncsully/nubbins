import { html } from 'htm/preact'
import { CountInput } from './CountInput'
import { Doubled } from './Doubled'

export const PreactComponent = () => {
  return html`
    <section>
      <h2>Preact</h2>
      <${CountInput} />
      <${Doubled} />
    </section>
  `
}
