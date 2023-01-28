import '../style.css'
import { renderPreact } from './components/preact/renderPreact'
import { renderVanilla } from './components/vanilla/renderVanilla'
import { renderReact } from './components/react/renderReact'
import { renderHaunted } from './components/haunted/renderHaunted'
import { renderLit } from './components/lit/renderLit'
import { renderSvelte } from './components/svelte/renderSvelte'
import { renderVue } from './components/vue/renderVue'
// import { render as renderSolid } from 'solid-js/web'
// import { SolidComponent } from '../../../src/solid/components/SolidComponent'
// import { createApp as createVueApp } from 'vue'
// // *sigh* do I care enough?
// // @ts-ignore
// import VueComponent from '../../../src/vue/components/VueComponent.vue'

renderVanilla()
renderReact()
renderPreact()
renderHaunted()
renderLit()
renderSvelte()

renderVue()
/* // ============================================================================
// Solid
// ============================================================================
const solidContainer = createDivAndAppendToBody('solid-app')
renderSolid(SolidComponent, solidContainer!) */
