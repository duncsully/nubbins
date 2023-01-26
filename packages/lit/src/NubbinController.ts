import { ReactiveController, ReactiveControllerHost } from 'lit'
import { ComputedNubbin, Nubbin } from 'nubbins'

// TODO: Test getter/setter
export class NubbinController<T extends Nubbin<any> | ComputedNubbin<any>>
  implements ReactiveController
{
  get: typeof Nubbin.prototype.get

  set: T extends Nubbin<infer R> ? Nubbin<R>['set'] : undefined

  constructor(public host: ReactiveControllerHost, protected _nubbin: T) {
    host.addController(this)
    this.get = _nubbin.get.bind(_nubbin)

    if ('set' in _nubbin) {
      this.set = _nubbin.set.bind(_nubbin) as T extends Nubbin<infer R>
        ? Nubbin<R>['set']
        : undefined
    } else {
      this.set = undefined as T extends Nubbin<infer R>
        ? Nubbin<R>['set']
        : undefined
    }
    this.requestUpdate = () => this.host.requestUpdate()
  }

  get value() {
    return this.get()
  }
  set value(newValue: T extends Nubbin<infer R> ? R : never) {
    this.set?.(newValue)
  }

  hostConnected() {
    this._nubbin.observe(this.requestUpdate)
  }

  hostDisconnected() {
    this._nubbin.unsubscribe(this.requestUpdate)
  }

  private requestUpdate: () => void
}
