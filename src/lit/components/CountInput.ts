import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { counter } from '../../counter'
import { NubbinController } from '../NubbinController'

@customElement('lit-count-input')
export class CountInput extends LitElement {
  counter = new NubbinController(this, counter)

  render() {
    return html` <input
      type="number"
      .value=${this.counter.get()}
      @input=${this.handleChange}
    />`
  }

  private handleChange = (e: Event) =>
    this.counter.set((e?.currentTarget as HTMLInputElement).valueAsNumber)
}
