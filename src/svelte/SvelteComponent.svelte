<script>
  import { counter, doubled } from '../counter'
</script>

<section>
  <h2>Svelte</h2>
  <input type="number" bind:value={$counter} />
  <p>Doubled: {$doubled}</p>
</section>
