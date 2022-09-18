import { ReactiveController, ReactiveControllerHost } from 'lit'
import { Nubbin } from '../core'

// TODO: Improve ergonomics? Turn into decorator?
export class NubbinController<T> implements ReactiveController {
  get: typeof Nubbin.prototype.get

  set: typeof Nubbin.prototype.set

  constructor(
    public host: ReactiveControllerHost,
    protected _nubbin: Nubbin<T>
  ) {
    host.addController(this)
    this.get = _nubbin.get.bind(_nubbin)
    this.set = _nubbin.set.bind(_nubbin)
    this.requestUpdate = () => this.host.requestUpdate()
  }

  hostConnected() {
    this._nubbin.observe(this.requestUpdate)
  }

  hostDisconnected() {
    this._nubbin.unsubscribe(this.requestUpdate)
  }

  private requestUpdate: () => void
}
