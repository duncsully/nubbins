import { Datum } from './core'

export const counter = new Datum(0)

export const doubled = new Datum(() => counter.get() * 2)
