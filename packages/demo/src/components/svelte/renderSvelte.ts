import { createDivAndAppendToBody } from '../../utils'
import SvelteComponent from './SvelteComponent.svelte'

export const renderSvelte = () => {
  const svelteContainer = createDivAndAppendToBody('svelte-app')
  new SvelteComponent({ target: svelteContainer })
}
