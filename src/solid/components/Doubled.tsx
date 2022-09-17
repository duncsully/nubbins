import { doubled } from '../../counter'
import { datumSignal } from '../datumSignal'
import html from 'solid-js/html'

export const Doubled = () => {
  const [double] = datumSignal(doubled)

  return html`<p>Doubled: ${double}</p>`
}
