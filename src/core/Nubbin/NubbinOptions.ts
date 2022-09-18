// TODO: Automatically batch updates without Nubbin.action? Would probably have to be a static option
// I could see reasons for both
// TODO: Better type inference: no set method + value setter if getter without setter passed?
// TODO: Track first value? Reset option?

export interface NubbinOptions<T> {
  hasChanged?(currentValue: T | undefined, newValue: T): boolean
}
