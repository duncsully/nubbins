<script setup lang="ts">
  import { nubbinRef } from '../nubbinRef'
  import { counter } from 'nubbins-common'

  const count = nubbinRef(counter)
</script>

<template>
  <input type="number" v-model="count" />
</template>