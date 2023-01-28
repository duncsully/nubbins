import React from 'react'
import ReactDOM from 'react-dom/client'
import { createDivAndAppendToBody } from '../../utils'
import { ReactComponent } from './ReactComponent'

export const renderReact = () => {
  const reactContainer = createDivAndAppendToBody('react-app')
  const root = ReactDOM.createRoot(reactContainer)
  root.render(React.createElement(ReactComponent))
}
