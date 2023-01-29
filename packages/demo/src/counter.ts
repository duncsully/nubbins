import { nubbin } from '@nubbins/core'

export const counter = nubbin(0)

export const doubled = nubbin(() => counter.get() * 2)
