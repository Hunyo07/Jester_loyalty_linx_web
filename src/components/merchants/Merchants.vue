<script setup>
import { onMounted, ref } from "vue";
import ModalMerchants from "../Credits/ApplicationForm.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
const limit = JSON.parse(sessionStorage.getItem("limit"));
const balanceString = JSON.parse(sessionStorage.getItem("u_CRDBAl"));
const balance = parseInt(balanceString); // convert balance to integer
const router = useRouter();
const newBalance = balance + 500;

const props = defineProps(["item"]);
let showModal = ref(false);

const handleMerchant = (name) => {
  console.log(name);
};

const hideModal = () => {
  showModal.value = false;
};

const unHideModal = (merchantGroup) => {
  if (newBalance < limit) {
    sessionStorage.setItem("merchantItem", JSON.stringify(merchantGroup));
    router.push({
      name: "apply/credit",
    });
  } else {
    Swal.fire({
      title: "Request fail!",
      text: "Limit exceed!",
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        router.replace("/home");
      }
    });
  }
  // if (newBalance < limit) {
  //   sessionStorage.setItem("merchantItem", JSON.stringify(merchantGroup));
  //   showModal.value = true;
  // } else {
  //   Swal.fire({
  //     title: "Request fail!",
  //     text: "Limit exceed!",
  //     icon: "error",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       showModal.value = false;
  //     }
  //   });
  // }
};
const theme = ref(null);
if (localStorage.getItem("theme")) {
  theme.value = JSON.parse(localStorage.getItem("theme"));
}
</script>
<template>
  <div class="bg-white mx-3 py-2">
    <div class="p-4">
      <h2
        class="font-bold font-md text-[#4635B1] m-1"
        :style="{ color: theme?.textColor || '#1b1b1c' }"
      >
        Merchants
      </h2>
      <div class="h-px w-full bg-slate-200"></div>
    </div>
    <div class="grid grid-cols-3 gap-3 mx-auto px-5 max-w-100">
      <button
        @click="unHideModal(merchantGroup)"
        v-for="merchantGroup in item"
        :key="merchantGroup.storeName"
        class="bg-white rounded-md p-2 hover:bg-gray-50"
      >
        <div>
          <img
            class="w-[5rem] mx-auto"
            :src="merchantGroup.profilePicture"
            alt=""
          />
          <p
            id="name"
            class="font-semibold text-sm text-[#4635B1]"
            :style="{ color: theme?.textColor || '#1b1b1c' }"
          >
            {{ merchantGroup.storeName }}
          </p>
        </div>
      </button>
      <div
        :class="{ hidden: !showModal }"
        tabindex="-1"
        class="flex bg-gray-700 bg-opacity-70 overflow-y-auto overflow-x-hidden my-auto fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="p-4 w-full max-w-md max-h-full">
          <!-- Modal content -->
          <div class="bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <!-- <div
              class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
             
              </h3>
              <button
                @click="hideModal"
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div> -->
            <!-- Modal body -->
            <!-- <ModalMerchants /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
