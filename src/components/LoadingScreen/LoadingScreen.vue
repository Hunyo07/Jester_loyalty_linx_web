<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>
/* You can add any additional styling here if needed */
</style>
