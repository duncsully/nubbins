import { ComputedNubbin, Nubbin } from '@nubbins/core'
import { ReactiveElement } from 'lit'

// TODO: Robust enough? Any usability enhancements?

/**
 * Property decorator factory for Lit nubbin properties
 * @param nubbin
 * @returns property decorator
 */
export const nubbinProperty =
  <T extends Nubbin<any> | ComputedNubbin<any>>(nubbin: T) =>
  (target: any, key: string) => {
    const ctor = target.constructor as typeof ReactiveElement
    ctor.addInitializer(instance => {
      const unsubscribe = nubbin.observe(() => instance.requestUpdate())
      const oldDisconnectedCallback = instance.disconnectedCallback
      instance.disconnectedCallback = () => {
        oldDisconnectedCallback?.()
        unsubscribe()
      }
    })
    const descriptor: PropertyDescriptor = {
      get() {
        return nubbin.get()
      },
    }
    if ('set' in nubbin) {
      descriptor.set = (value: T) => {
        nubbin.set(value)
      }
    }
    Object.defineProperty(target, key, descriptor)
  }
