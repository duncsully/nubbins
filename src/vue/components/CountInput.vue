<script setup lang="ts">
  import { datumRef } from '../datumRef'
  import { counter } from '../../counter'

  const count = datumRef(counter)
</script>

<template>
  <input type="number" v-model="count" />
</template>