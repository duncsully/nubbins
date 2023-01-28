import { createDivAndAppendToBody } from '../../utils'
import { render } from 'solid-js/web'
import { SolidComponent } from './SolidComponent'

export const renderSolid = () => {
  const solidContainer = createDivAndAppendToBody('solid-app')
  render(SolidComponent, solidContainer)
}
