import { ReactiveController, ReactiveControllerHost } from 'lit'
import { Datum } from '../datum'

// TODO: Improve ergonomics? Turn into decorator?
export class DatumController<T> implements ReactiveController {
  get: typeof Datum.prototype.get

  set: typeof Datum.prototype.set

  constructor(public host: ReactiveControllerHost, protected _datum: Datum<T>) {
    host.addController(this)
    this.get = _datum.get.bind(_datum)
    this.set = _datum.set.bind(_datum)
    this.requestUpdate = () => this.host.requestUpdate()
  }

  hostConnected() {
    this._datum.observe(this.requestUpdate)
  }

  hostDisconnected() {
    this._datum.unsubscribe(this.requestUpdate)
  }

  private requestUpdate: () => void
}
