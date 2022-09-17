import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { doubled } from '../../counter'
import { DatumController } from '../DatumController'

@customElement('lit-doubled')
export class Doubled extends LitElement {
  doubled = new DatumController(this, doubled)

  render() {
    return html` <p>Doubled: ${this.doubled.get()}</p> `
  }
}
