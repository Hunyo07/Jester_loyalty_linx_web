<script setup>
import { ref } from "vue";
import Pointstable from "../tables/Table.vue";
const props = defineProps(["brands"]);

const theme = ref(null);

if (localStorage.getItem("theme")) {
  theme.value = JSON.parse(localStorage.getItem("theme"));
}
</script>

<template>
  <div class="bg-white mx-3">
    <div class="overflow-x-auto p-3 mx-auto sm:rounded-lg">
      <div
        class="h-[30rem] rounded-lg pb-2.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <div class="px-4 mb-4">
          <h2
            class="font-bold font-md m-1"
            :style="{ color: theme?.textColor || '#1b1b1c' }"
          >
            History
          </h2>
          <div class="h-px w-full bg-slate-200"></div>
        </div>
        <div v-if="brands && brands.length">
          <div v-for="brand in brands" :key="brand.name">
            <Pointstable :data="brand" />
          </div>
        </div>
        <div class="flex justify-center py-10" v-else>
          <h1 class="font-bold text-gray-700">No history</h1>
        </div>
      </div>
    </div>
  </div>
</template>
