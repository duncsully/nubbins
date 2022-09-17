# To Be Named

An atom-based state management library that use Datum objects to track individual pieces of state.

## Use with your favorite frontend libraries

### React / Preact / Haunted

A `useDatum` hook is provided for these three libraries. It operates much the same way as the `useState` hook, returning a tuple with the current value of the datum as the first item and the setter for the datum as the second item.

```typescript
import { someDatum } from './someDatum'
import { useDatum } from 'datum-js/react' // use datum-js/haunted or datum-js/preact for their respective versions

// ...someComponent
const [myDatum, setMyDatum] = useDatum(someDatum)

// read
const doubled = myDatum

// write
setMyDatum(5)
```

# Preact signals

Preact signal support is also provided with the `useDatumSignal` hook. This allows you to read and set a reactive `.value` property, and also leverage Preact's optimizations when passing a signal directly into its templates.

```jsx
import { someDatum } from './someDatum'
import { useDatumSignal } from 'datum-js/preact'

const SomeComponent = () => {
  const myDatum = useDatumSignal(someDatum)

  // read
  const doubled = myDatum.value

  // write
  myDatum.value = 5

  // pass signal in directly
  return <input value={myDatum} />
}
```

### Solid

Solid support is provided via a `datumSignal` utility which converts a provided datum into a Solid signal and returns a tuple with a getter and setter.

```typescript
import { someDatum } from './someDatum'
import { datumSignal } from 'datum-js/solid'

const [myDatum, setMyDatum] = datumSignal(someDatum)

// read
const doubled = myDatum() * 2

// write
setMyDatum(5)
```

### Vue

A `datumRef` utility is provided to transform a datum into a Vue ref, which has a reactive `.value` property. This allows you to use two-way binding as you could with any other ref.

```vue
<script setup>
  import { someDatum } from './someDatum'
  import { datumRef } from 'datum-js/vue'

  const someDatumRef = datumRef(someDatum)

  // read
  const doubled = someDatumRef.value * 2

  // write
  someDatumRef.value = 5
</script>

<template>
  <!-- two-way bind -->
  <input v-model="someDatumRef"/>
</template>
```

### Svelte

Conveniently, since Datums follow the store contract of Svelte, you can use them directly in your Svelte components without any additional code by prefixing the datum variable with `$`.

```svelte
<script>
  import { someDatum } from './someDatum'

  // read
  const doubled = $someDatum * 2

  // write
  $someDatum = 5
</script>

<!-- two-way bind -->
<input bind:value={$someDatum}>
```

## Batching Updates

In cases where you're setting multiple datums at a time, it's highly recommended to wrap your updates in `Datum.action` to reduce unnecessary updates to subscribers. This is especially useful for "computed" or "derived" data.

```typescript
const width = new Datum(1)
const length = new Datum(20)
const area = new Datum(width.get() * length.get())
area.subscribe(console.log) // > 20

// Setting these individually will trigger area subscriber each time
width.set(2) // > 40
length.set(10) // > 20
// Whoops!

// But wrapping set calls in Datum.action batches the updates
Datum.action(() => {
  width.set(4)
  length.set(5)
})
// Since area is still 20 after the action completed, area's subscribers won't be updated
```

## .get() and .set() vs .value

To provide an API that is familiar across various FE libraries, Datum objects have both a pair of `.get()` and `.set()` methods and also a `.value` property that aliases the `.get()` and `.set()` methods. The methods probably look familiar to users of Svelte stores and, to a lesser extent, Solid signals, while the `.value` property probably looks more familiar to users of Vue refs and Preact signals.

While you are free to use either, or any combination of them for that matter, the methods are preferred because:

- It is explicit that your read or write action does other things (i.e. hooks into an FE library's lifecycle)
- Following off the last point, the set method allows passing a function to dynamically set the next value based on the current value that gets passed to the function. This technically is still supported with `.value` but would look more confusing e.g. `someDatum.value = value => value + 1`
- The methods can maintain context in a destructuring assignment, allowing you to use them "disconnected" from the Datum

## Setters

While the option is provided to add a setter, it's intended primarily to be used for tying a Datum to an external source of data, such as the URL or local/session storage. It isn't recommended to make a sort of "two-way" computed value, e.g. setting full name to then set a first name and last name Datum pair. In those cases, it's best to use an action function that sets the individual Datum objects.
