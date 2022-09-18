# Nubbins

An atom-based state management library that use nubbin objects to track individual pieces of state.

## Use with your favorite frontend libraries

### React / Preact / Haunted

A `useNubbin` hook is provided for these three libraries. It operates much the same way as the `useState` hook, returning a tuple with the current value of the nubbin as the first item and the setter for the nubbin as the second item.

```typescript
import { someNubbin } from './someNubbin'
import { useNubbin } from 'nubbins/react' // use nubbins/haunted or nubbins/preact for their respective versions

// ...someComponent
const [myNubbin, setMyNubbin] = useNubbin(someNubbin)

// read
const doubled = myNubbin

// write
setMyNubbin(5)
```

# Preact signals

Preact signal support is also provided with the `useNubbinSignal` hook. This allows you to read and set a reactive `.value` property, and also leverage Preact's optimizations when passing a signal directly into its templates.

```jsx
import { someNubbin } from './someNubbin'
import { useNubbinSignal } from 'nubbins/preact'

const SomeComponent = () => {
  const myNubbin = useNubbinSignal(someNubbin)

  // read
  const doubled = myNubbin.value

  // write
  myNubbin.value = 5

  // pass signal in directly
  return <input value={myNubbin} />
}
```

### Solid

Solid support is provided via a `nubbinSignal` utility which converts a provided nubbin into a Solid signal and returns a tuple with a getter and setter.

```typescript
import { someNubbin } from './someNubbin'
import { nubbinSignal } from 'nubbins/solid'

const [myNubbin, setMyNubbin] = nubbinSignal(someNubbin)

// read
const doubled = myNubbin() * 2

// write
setMyNubbin(5)
```

### Vue

A `nubbinRef` utility is provided to transform a nubbin into a Vue ref, which has a reactive `.value` property. This allows you to use two-way binding as you could with any other ref.

```vue
<script setup>
  import { someNubbin } from './someNubbin'
  import { nubbinRef } from 'nubbins/vue'

  const someNubbinRef = nubbinRef(someNubbin)

  // read
  const doubled = someNubbinRef.value * 2

  // write
  someNubbinRef.value = 5
</script>

<template>
  <!-- two-way bind -->
  <input v-model="someNubbinRef"/>
</template>
```

### Svelte

Conveniently, since nubbins follow the store contract of Svelte, you can use them directly in your Svelte components without any additional code by prefixing the nubbin variable with `$`.

```svelte
<script>
  import { someNubbin } from './someNubbin'

  // read
  const doubled = $someNubbin * 2

  // write
  $someNubbin = 5
</script>

<!-- two-way bind -->
<input bind:value={$someNubbin}>
```

## Batching Updates

In cases where you're setting multiple nubbins at a time, it's highly recommended to wrap your updates in `Nubbin.action` to reduce unnecessary updates to subscribers. This is especially useful for "computed" or "derived" data. You can nest actions and the updates won't be made until the top-level action finishes. 

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

To provide an API that is familiar across various FE libraries, nubbin objects have both a pair of `.get()` and `.set()` methods and also a `.value` property that aliases the `.get()` and `.set()` methods. The methods probably look familiar to users of Svelte stores and, to a lesser extent, Solid signals, while the `.value` property probably looks more familiar to users of Vue refs and Preact signals.

While you are free to use either, or any combination of them for that matter, the methods are preferred because:

- It is explicit that your read or write action does other things (i.e. hooks into an FE library's lifecycle)
- Following off the last point, the set method allows passing a function to dynamically set the next value based on the current value that gets passed to the function. This technically is still supported with `.value` but would look more confusing e.g. `someNubbin.value = value => value + 1`
- The methods can maintain context in a destructuring assignment, allowing you to use them "disconnected" from the nubbin

## Setters

While the option is provided to add a setter, it's intended primarily to be used for tying a nubbin to an external source of data, such as the URL or local/session storage. It isn't recommended to make a sort of "two-way" computed value, e.g. setting full name to then set a first name and last name nubbin pair. In those cases, it's best to use an action function that sets the individual nubbin objects.
