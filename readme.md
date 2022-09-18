# Nubbins

An atom-based state management library that uses nubbin objects to track individual pieces of state.

## Why atom-based?

When it comes to managing complexity, we're used to breaking larger things up into smaller things and composing those smaller things together to make software: projects get divided into folders and files, code is divided up into classes and functions, and pages are divided up into components. Likewise, we should divide state and actions up into small pieces and compose them together as much as possible. This makes it easier to share state, and only share the state you need, resulting in better code-splitting. Nubbins was also designed to interop with all of the popular frontend libraries so that you can keep all of your business logic state out of your view layer and easily switch between and/or swap out FE libraries with little friction. Updates are precise and performant. 


## Creating

```typescript
// read-write nubbin
export const countNubbin = nubbin(0)
```

### Readonly/computed/derived nubbins

Pass a pure function to the Nubbin constructor to create a nubbin that is readonly. It will track as dependencies any nubbins that are used in the function. After the first call to initialize, all read computations are lazy and memoized; if a nubbin has no subscribers, it will wait until its value is read before it will recompute it, and then it will only recompute if any of its dependencies change. This works even if the dependencies aren't all exposed right away in the getter function (i.e. conditionally read).

```typescript
export const countNubbin = nubbin(0)
// Will track updates to countNubbin, but won't recompute until read
export const doubledNubbin = nubbin(() => countNubbin.get() * 2)
```

## Using nubbins

Read:

```typescript
countNubbin.get()
// or~
countNubbin.value
```

Write:

```typescript
countNubbin.set(5)
// or~
countNubbin.value = 5
```

~[See recommendation](#get-and-set-vs-value)

Subscribe:

```typescript
countNubbin.subscribe(value => {
  // will be immediately invoked with the current value
})

countNubbin.observe(() => {
  // won't be invoked until next update
})
```

## Use with your favorite frontend libraries

### React / Preact / Haunted

A `useNubbin` hook is provided for each of these libraries. It operates much the same way as the `useState` hook, returning a tuple with the current value of the nubbin as the first item and the setter for the nubbin as the second item.

```typescript
import { countNubbin } from './countNubbin'
import { useNubbin } from 'nubbins/react' // use nubbins/haunted or nubbins/preact for their respective versions

// ...someComponent
const [count, setCount] = useNubbin(countNubbin)

// read
const doubled = count * 2

// write
setCount(5)
```

### Preact signals

Preact signal support is also provided with the `useNubbinSignal` hook. This allows you to read and set a reactive `.value` property, and also leverage Preact's optimizations when passing a signal directly into its templates.

```jsx
import { countNubbin } from './countNubbin'
import { useNubbinSignal } from 'nubbins/preact'

const SomeComponent = () => {
  const count = useNubbinSignal(countNubbin)

  // read
  const doubled = count.value * 2

  // write
  count.value = 5

  // pass signal in directly
  return <input value={count} />
}
```

### Solid

Solid support is provided via a `nubbinSignal` utility which converts a provided nubbin into a Solid signal and returns a tuple with a getter and setter.

```typescript
import { countNubbin } from './countNubbin'
import { nubbinSignal } from 'nubbins/solid'

const [count, setCount] = nubbinSignal(countNubbin)

// read
const doubled = count() * 2

// write
setCount(5)
```

### Vue

A `nubbinRef` utility is provided to transform a nubbin into a Vue ref, which has a reactive `.value` property. This allows you to use two-way binding as you could with any other ref.

```vue
<script setup>
  import { countNubbin } from './countNubbin'
  import { nubbinRef } from 'nubbins/vue'

  const countRef = nubbinRef(countNubbin)

  // read
  const doubled = countRef.value * 2

  // write
  countRef.value = 5
</script>

<template>
  <!-- two-way bind -->
  <input v-model="countRef"/>
</template>
```

### Svelte

Conveniently, since nubbins follow the store contract of Svelte, you can use them directly in your Svelte components without any additional code by prefixing the nubbin variable with `$`.

```svelte
<script>
  import { countNubbin } from './countNubbin'

  // read
  const doubled = $countNubbin * 2

  // write
  $countNubbin = 5
</script>

<!-- two-way bind -->
<input bind:value={$countNubbin}>
```

## Batching Updates

In cases where you're setting multiple nubbins at a time, it's highly recommended to wrap your updates in `Nubbin.action` to reduce unnecessary updates to subscribers. This is especially useful for more complex computed nubbins. You can nest actions and the updates won't be made until the top-level action finishes. 

```typescript
const width = new Nubbin(1)
const length = new Nubbin(20)
const area = new Nubbin(width.get() * length.get())
area.subscribe(console.log) // > 20

// Setting these individually will trigger area subscriber each time
width.set(2) // > 40
length.set(10) // > 20
// Whoops!

// But wrapping set calls in Nubbin.action batches the updates
Nubbin.action(() => {
  width.set(4)
  length.set(5)
})
// Since area is still 20 after the action completed, area's subscribers won't be updated
```

## .get() and .set() vs .value

[](#methods-vs-property)To provide an API that is familiar across various FE libraries, nubbin objects have both a pair of `.get()` and `.set()` methods and also a `.value` property that aliases the `.get()` and `.set()` methods. The methods probably look familiar to users of Svelte stores and, to a lesser extent, Solid signals, while the `.value` property probably looks more familiar to users of Vue refs and Preact signals.

While you are free to use either, or any combination of them for that matter, the methods are preferred because:

- It is explicit that your read or write action does other things (i.e. hooks into an FE library's lifecycle)
- Following off the last point, the set method allows passing a function to dynamically set the next value based on the current value that gets passed to the function. This technically is still supported with `.value` but would look more confusing e.g. `countNubbin.value = value => value + 1`
- The methods can maintain context in a destructuring assignment, allowing you to use them "disconnected" from the nubbin
