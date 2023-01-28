import html from 'solid-js/html'
import { CountInput } from './CountInput'
import { Doubled } from './Doubled'

export const SolidComponent = () => {
  return html` <section>
    <h2>Solid</h2>
    ${CountInput} ${Doubled}
  </section>`
}
