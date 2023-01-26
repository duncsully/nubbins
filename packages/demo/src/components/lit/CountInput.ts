import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { counter } from '../../counter'
import { nubbinProperty } from 'nubbins-lit'

@customElement('lit-count-input')
export class CountInput extends LitElement {
  @nubbinProperty(counter)
  // Not necessary, but good to infer type based on the nubbin's value
  counter = counter.value

  render() {
    return html` <input
      type="number"
      .value=${this.counter}
      @input=${this.handleChange}
    />`
  }

  private handleChange = (e: Event) =>
    (this.counter = (e?.currentTarget as HTMLInputElement).valueAsNumber)
}
