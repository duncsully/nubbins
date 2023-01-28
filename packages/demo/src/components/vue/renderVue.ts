import { createDivAndAppendToBody } from '../../utils'
import { createApp } from 'vue'
// @ts-ignore
import VueComponent from './VueComponent.vue'

export const renderVue = () => {
  createApp(VueComponent).mount(createDivAndAppendToBody('vue-app'))
}
