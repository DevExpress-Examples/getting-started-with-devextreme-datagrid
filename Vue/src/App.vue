<template>
  <div class="main">
    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped>
.main {
  padding: 20px;
}
</style>
