<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps(["item", "index", "credits"]);
const progressBarWidth = computed(() => {
  if (!props.item.value) return 0;
  return `${(props.item.used / props.item.max) * 100}%`;
});
const formattedMaxAmount = computed(() => {
  return new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(props.item.max);
});

const formattedUsed = computed(() => {
  return new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(props.item.used);
});

const formattedCreditAmount = computed(() => {
  return new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(props.item.value);
});

const showDetails = ref(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
const theme = ref(null);
const storedTheme = localStorage.getItem("theme");
theme.value = JSON.parse(storedTheme);
</script>

<template>
  <div class="w-full justify-center items-center flex flex-col">
    <li
      class="block w-[90%] p-5 my-2 rounded-lg bg-[#3D3BF3] shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      :style="{ backgroundColor: theme?.backgroundColor || '#3D3BF3' }"
    >
      <div class="flex flex-col">
        <h5
          class="mb-2 underline underline-offset-4 text-center text-4xl font-bold tracking-tight text-[#EBEAFF] dark:text-white"
          :style="{ color: theme?.primary || '#EBEAFF' }"
        >
          {{ formattedCreditAmount }}
        </h5>
        <div>
          <p
            class="text-center font-semibold py-2 text-sm text-gray-200 dark:text-gray-400"
          >
            {{ item.label }}
          </p>
        </div>
      </div>
      <div v-if="item.progress">
        <div class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            class="bg-[#9694FF] h-2.5 rounded-full"
            :style="{
              width: progressBarWidth,
              backgroundColor: theme?.secondaryColor || '#42414215',
            }"
          ></div>
        </div>
        <div class="flex justify-between">
          <h1 class="text-gray-200 text-sm mt-2 font-semibold">
            {{ formattedUsed }} Used
          </h1>
          <h1 class="text-gray-200 text-sm mt-2 font-semibold">
            {{ formattedMaxAmount }} Limit
          </h1>
        </div>
      </div>
      <div v-if="item.progress">
        <button
          @click="toggleDetails"
          class="mt-3 w-full py-2 text-sm font-semibold text-white bg-[#9694FF] rounded-sm hover:bg-[#9a98fc] focus:outline-none"
          :style="{ backgroundColor: theme?.secondaryColor || '#9694FF' }"
        >
          {{ showDetails ? "Hide Details" : "View Details" }}
        </button>
        <div v-if="showDetails">
          <div
            v-for="(item, index) in credits"
            :key="index"
            class="flex flex-col mt-3 rounded-md bg-gray-100 dark:bg-gray-700"
          >
            <div v-if="item.isApproved">
              <div
                :class="` flex flex-row    rounded-sm bg-white sm:grid-cols-3 hover:bg-gray-50 
      ${
        index === item.length - 1
          ? ''
          : 'border-b border-stroke dark:border-strokedark'
      }`"
              >
                <div class="flex col-span-1 w-auto items-center p-2.5 xl:p-5">
                  <div class="flex-shrink-0 border p-3 rounded-lg">
                    <img :src="item.merchantLogo" alt="" class="h-10" />
                  </div>
                </div>

                <div class="flex flex-1 flex-col justify-center p-2.5 xl:p-5">
                  <div>
                    <p
                      class="text-gray-700 text-md font-semibold dark:text-white sm:block"
                    >
                      {{ item.merchantName }}
                    </p>
                  </div>

                  <div>
                    <p
                      v-if="item.applicationDate"
                      class="text-gray-500 text-xs dark:text-white sm:block"
                    >
                      {{
                        new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(new Date(item.applicationDate))
                      }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex flex-2 items-center justify-center text-center p-2.5 xl:p-5"
                >
                  <p class="text-black dark:text-white">
                    +{{ item.creditAmount }}.00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </div>
</template>
