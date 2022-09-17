<script setup lang="ts">
  import { doubled } from '../../counter'
  import { datumRef } from '../datumRef'
    
  const double = datumRef(doubled)
</script>

<template>
  <p>Doubled: {{ double }}</p>
</template>