import './style.css'
import ReactDOM from 'react-dom/client'
import { ReactComponent } from './react/ReactComponent'
import React from 'react'
import { counter, doubled } from './counter'
import { setupHaunted } from './haunted/HauntedComponent'
import './lit/LitComponent'

// TODO:
// - Vue
// - Svelte
// - Angular?
// - Wrap everything in updating border
// - search and persisted examples

// ============================================================================
// Vanilla
// ============================================================================
const setupVanilla = () => {
  const vanillaContainer = document.querySelector('#vanilla-app')
  vanillaContainer!.innerHTML = `
        <h2>Vanilla</h2>
        <input id="vanilla-input" type="number"/>
        <p>Doubled: <span id="vanilla-doubled"></span></p>
    `
  const vanillaInput = document.querySelector(
    '#vanilla-input'
  ) as HTMLInputElement
  const vanillaDoubled = document.querySelector('#vanilla-doubled')

  vanillaInput.valueAsNumber = counter.get()

  counter.subscribe(() => {
    if (vanillaInput) {
      vanillaInput.valueAsNumber = counter.get()
    }
  })

  doubled.subscribe(() => {
    if (vanillaDoubled) {
      vanillaDoubled.textContent = doubled.get().toString()
    }
  })

  vanillaInput?.addEventListener('change', e =>
    counter.set((e?.target as HTMLInputElement).valueAsNumber)
  )
}
setupVanilla()

// ============================================================================
// React
// ============================================================================
const reactContainer = document.querySelector('#react-app')
// TODO: Figure out why type won't work
// @ts-ignore
const root = ReactDOM.createRoot(reactContainer)
root.render(React.createElement(ReactComponent))

// ============================================================================
// Haunted
// ============================================================================
const componentName = 'haunted-component'
setupHaunted(componentName)
const hauntedComponent = document.createElement(componentName)
document.querySelector('#haunted-app')?.append(hauntedComponent)

// ============================================================================
// Lit
// ============================================================================
const litContainer = document.querySelector('#lit-app')
const litComponent = document.createElement('lit-component')
litContainer?.append(litComponent)
