import { html } from 'htm/preact'
import { doubled } from '../counter'
import { useNubbinSignal } from './useNubbinSignal'

export const Doubled = () => {
  const double = useNubbinSignal(doubled)

  return html`<p>Doubled: ${double}</p>`
}
