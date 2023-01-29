<script setup lang="ts">
  import { nubbinRef } from '@nubbins/vue'
  import { counter } from '../../counter'

  const count = nubbinRef(counter)
</script>

<template>
  <input type="number" v-model="count" />
</template>