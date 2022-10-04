import { html, virtual } from 'haunted'
import { doubled } from 'nubbins-common'
import { useNubbin } from '../useNubbin'

export const Doubled = virtual(() => {
  const [double] = useNubbin(doubled)

  return html`<p>Doubled: ${double}</p>`
})
