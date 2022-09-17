import { html, virtual } from 'haunted'
import { doubled } from '../../counter'
import { useDatum } from '../useDatum'

export const Doubled = virtual(() => {
  const [double] = useDatum(doubled)

  return html`<p>Doubled: ${double}</p>`
})
