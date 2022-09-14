<script setup lang="ts">
    import { counter, doubled } from '../counter'
    import { datumRef } from './datumRef'

    const count = datumRef(counter)
    const double = datumRef(doubled)
</script>

<template>
  <section>
    <h2>Vue</h2>
    <input type="number" v-model="count" />
    <p>Doubled: {{ double }}</p>
  </section>
</template>