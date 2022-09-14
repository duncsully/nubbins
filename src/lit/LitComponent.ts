import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { counter, doubled } from '../counter'
import { DatumController } from './DatumController'

@customElement('lit-component')
export class LitComponent extends LitElement {
  counter = new DatumController(this, counter)
  doubled = new DatumController(this, doubled)

  render() {
    return html`<section>
      <h2>Lit</h2>
      <input
        type="number"
        .value=${this.counter.get()}
        @input=${this.handleChange}
      />
      <p>Doubled: ${this.doubled.get()}</p>
    </section>`
  }

  private handleChange = (e: Event) =>
    this.counter.set((e?.currentTarget as HTMLInputElement).valueAsNumber)
}
