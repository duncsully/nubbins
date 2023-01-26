import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import './CountInput'
import './Doubled'

@customElement('lit-component')
export class LitComponent extends LitElement {
  render() {
    return html`<section>
      <h2>Lit</h2>
      <lit-count-input></lit-count-input>
      <lit-doubled></lit-doubled>
    </section>`
  }
}
