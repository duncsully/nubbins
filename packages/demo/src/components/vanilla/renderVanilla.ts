import { counter, doubled } from '../../counter'
import { createDivAndAppendToBody } from '../../utils'

export const renderVanilla = () => {
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
