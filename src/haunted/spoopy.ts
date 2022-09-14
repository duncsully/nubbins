import { component, html } from 'haunted'

let count = 0

/**
 * A way to create "anonymous" Haunted components so you can use Haunted
 * even more functionally inside html templates
 * @param renderer
 * @returns
 */
export const spoopy = <T extends object>(
  renderer: (props: T) => ReturnType<typeof html>
) => {
  const componentName = 'ce-' + count++
  // @ts-ignore
  customElements.define(componentName, component(renderer))

  // TODO: Need spread directive
  return (props: T) => html`
        <${componentName}></${componentName}>
    `
}

export const TestSpoopy = spoopy(({ test }: { test: string }) => {
  return html`<p>${test}</p>`
})
