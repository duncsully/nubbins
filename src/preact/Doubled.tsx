import { html } from 'htm/preact'
import { doubled } from '../counter'
import { useDatumSignal } from './useDatumSignal'

export const Doubled = () => {
  const double = useDatumSignal(doubled)

  return html`<p>Doubled: ${double}</p>`
}
