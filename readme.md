# To Be Named

To be described

## Use with your favorite frontend libraries

### React / Haunted

A `useDatum` hook is provided for both libraries. It operates much the same way as the `useState` hook, returning a tuple with the current value of the datum as the first item and the setter for the datum as the second item.

```typescript
const [myDatum, setMyDatum] = useDatum(someDatum)
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
