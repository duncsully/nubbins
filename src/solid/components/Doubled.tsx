import { doubled } from '../../counter'
import { nubbinSignal } from '../nubbinSignal'
import html from 'solid-js/html'

export const Doubled = () => {
  const [double] = nubbinSignal(doubled)

  return html`<p>Doubled: ${double}</p>`
}
