import { createDivAndAppendToBody } from '../../utils'
import { setupHaunted } from './HauntedComponent'

export const renderHaunted = () => {
  const componentName = 'haunted-component'
  setupHaunted(componentName)
  const hauntedComponent = document.createElement(componentName)
  createDivAndAppendToBody('haunted-app').append(hauntedComponent)
}
