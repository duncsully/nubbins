<script setup lang="ts">
  import { doubled } from '../../counter'
  import { nubbinRef } from '../nubbinRef'
    
  const double = nubbinRef(doubled)
</script>

<template>
  <p>Doubled: {{ double }}</p>
</template>