import './style.css'
import ReactDOM from 'react-dom/client'
import { ReactComponent } from './react/ReactComponent'
import React from 'react'

// TODO:
// - Vanilla
// - Vue
// - Lit
// - Svelte
// - Angular?
// - Wrap everything in updating border
// - search and persisted examples
const reactContainer = document.querySelector('#react-app')
// TODO: Figure out why type won't work
// @ts-ignore
const root = ReactDOM.createRoot(reactContainer)
root.render(React.createElement(ReactComponent))
