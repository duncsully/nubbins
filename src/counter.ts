import { nubbin } from '../packages/core/src'

export const counter = nubbin(0)

export const doubled = nubbin(() => counter.get() * 2)
