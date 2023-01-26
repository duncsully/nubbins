import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { doubled } from '../../counter'
import { NubbinController } from 'nubbins-lit'

@customElement('lit-doubled')
export class Doubled extends LitElement {
  doubled = new NubbinController(this, doubled)

  render() {
    return html` <p>Doubled: ${this.doubled.get()}</p> `
  }
}
