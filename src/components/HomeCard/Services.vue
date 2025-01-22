<script setup>
import { ref, toRaw, onMounted } from "vue";
import MerchantsSelection from "../Credits/MerchantsSelection.vue";
const props = defineProps(["services"]);
const propService = ref(props.services);
const services = toRaw(propService.value); // Convert Proxy to plain array
import { defineEmits } from "vue";

const emit = defineEmits(["serviceClicked"]);
const theme = ref(null);
// const unide = (servicesItem) => {
//   switch (servicesItem.id) {
//     case 1:
//       showModal.value = true;
//       break;
//     case 2:
//       // console.log(servicesItem);
//       break;
//     case 3:
//       // console.log(servicesItem);
//       break;
//     default:
//       console.log(`No function defined for service ${services}`);
//   }
// };

onMounted(() => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    theme.value = JSON.parse(storedTheme);
  }
});
</script>

<template>
  <div class="p-1 mx-3 mt-1">
    <div>
      <h2
        class="font-bold text-lg m-1 text-[#382b90]"
        :style="{ color: theme?.textColor || '#1b1b1c' }"
      >
        Services
      </h2>
      <!-- <div class="h-px w-full bg-slate-200"></div> -->
    </div>

    <div class="rounded">
      <div class="grid grid-cols-4 gap-1">
        <button
          @click="$emit('serviceClicked', service)"
          v-for="service in services"
          :key="service.id"
          class="p-1 hover:bg-gray-100"
        >
          <img class="w-[3em] mx-auto" :src="service.path" alt="" />
          <h4
            class="text-[0.7rem] text-md text-center font-semibold text-[#4635B1]"
            :style="{ color: theme?.textColor || '#1b1b1c' }"
          >
            {{ service.name }}
          </h4>
        </button>
      </div>
    </div>
  </div>
</template>
