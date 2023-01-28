import '../style.css'
import { renderPreact } from './components/preact/renderPreact'
import { renderVanilla } from './components/vanilla/renderVanilla'
import { renderReact } from './components/react/renderReact'
import { renderHaunted } from './components/haunted/renderHaunted'
import { renderLit } from './components/lit/renderLit'
import { renderSvelte } from './components/svelte/renderSvelte'
import { renderVue } from './components/vue/renderVue'
import { renderSolid } from './components/solid/renderSolid'

renderVanilla()
renderReact()
renderPreact()
renderHaunted()
renderLit()
renderSvelte()
renderSolid()
renderVue()
