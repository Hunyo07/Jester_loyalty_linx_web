<template>
  <div>
    <h1>Fetched Data</h1>
    <pre>{{ data }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const data = ref(null);

onMounted(async () => {

});
</script>

<style scoped>
/* Add any styles here */
</style>
