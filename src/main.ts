import './style.css'
import ReactDOM from 'react-dom/client'
import { ReactComponent } from './react/components/ReactComponent'
import React from 'react'
import { counter, doubled } from './counter'
import { setupHaunted } from './haunted/components/HauntedComponent'
import './lit/components/LitComponent'
import SvelteComponent from './svelte/components/SvelteComponent.svelte'
import { render as renderSolid } from 'solid-js/web'
import { SolidComponent } from './solid/components/SolidComponent'
import { createApp as createVueApp } from 'vue'
// *sigh* do I care enough?
// @ts-ignore
import VueComponent from './vue/components/VueComponent.vue'
import { render as renderPreact, html } from 'htm/preact'
import { PreactComponent } from './preact/PreactComponent'

// TODO:
// - Add test for FE utilities
// - Other FE libraries?
// - search and persisted examples
// - async nubbin?
// - object and array nubbin?
// - Add store utilities to other FEs?

const createDivAndAppendToBody = (id: string) => {
  const div = document.createElement('div')
  div.id = id
  document.body.append(div)
  return div
}

// ============================================================================
// Vanilla
// ============================================================================
const setupVanilla = () => {
  const vanillaContainer = createDivAndAppendToBody('vanilla-app')
  vanillaContainer!.innerHTML = `
        <h2>Vanilla</h2>
        <input id="vanilla-input" type="number"/>
        <p>Doubled: <span id="vanilla-doubled"></span></p>
    `
  const vanillaInput = document.querySelector(
    '#vanilla-input'
  ) as HTMLInputElement
  const vanillaDoubled = document.querySelector('#vanilla-doubled')

  counter.subscribe(value => {
    if (vanillaInput) {
      vanillaInput.valueAsNumber = value
    }
  })

  doubled.subscribe(value => {
    if (vanillaDoubled) {
      vanillaDoubled.textContent = value.toString()
    }
  })

  vanillaInput?.addEventListener('input', e =>
    counter.set((e?.currentTarget as HTMLInputElement).valueAsNumber)
  )
}
setupVanilla()

// ============================================================================
// React
// ============================================================================
const reactContainer = createDivAndAppendToBody('react-app')
// TODO: Figure out why type won't work
// @ts-ignore
const root = ReactDOM.createRoot(reactContainer)
root.render(React.createElement(ReactComponent))

// ============================================================================
// Preact
// ============================================================================
const preactContainer = createDivAndAppendToBody('preact-app')
renderPreact(html`<${PreactComponent} />`, preactContainer as HTMLElement)

// ============================================================================
// Haunted
// ============================================================================
const componentName = 'haunted-component'
setupHaunted(componentName)
const hauntedComponent = document.createElement(componentName)
createDivAndAppendToBody('haunted-app').append(hauntedComponent)

// ============================================================================
// Lit
// ============================================================================
const litContainer = createDivAndAppendToBody('lit-app')
const litComponent = document.createElement('lit-component')
litContainer?.append(litComponent)

// ============================================================================
// Svelte
// ============================================================================
const svelteContainer = createDivAndAppendToBody('svelte-app')
new SvelteComponent({ target: svelteContainer! })

// ============================================================================
// Solid
// ============================================================================
const solidContainer = createDivAndAppendToBody('solid-app')
renderSolid(SolidComponent, solidContainer!)

// ============================================================================
// Vue
// ============================================================================
createVueApp(VueComponent).mount(createDivAndAppendToBody('vue-app'))
