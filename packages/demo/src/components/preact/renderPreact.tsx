/** @jsxImportSource preact */
import { PreactComponent } from './PreactComponent'
import { render } from 'preact'
import { createDivAndAppendToBody } from '../../utils'

export const renderPreact = () => {
  const preactContainer = createDivAndAppendToBody('preact-app')
  render(<PreactComponent />, preactContainer)
}
