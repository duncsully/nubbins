import { Nubbin } from './core'

export const counter = new Nubbin(0)

export const doubled = new Nubbin(() => counter.get() * 2)
