import { createDivAndAppendToBody } from '../../utils'
import './LitComponent'

export const renderLit = () => {
  const litContainer = createDivAndAppendToBody('lit-app')
  const litComponent = document.createElement('lit-component')
  litContainer?.append(litComponent)
}
