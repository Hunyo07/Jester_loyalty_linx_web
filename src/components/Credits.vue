<script setup>
import { ref, onMounted, computed } from "vue";
import PointsCard from "./PointsCard/PointsCard.vue";
import PointsHistory from "./PointsCard/PointsHistory.vue";
import Services from "./HomeCard/Services.vue";
// import ApplyCreditPath from "../assets/img/credits/invoice-apply-line-svgrepo-com.svg";
import ApplyCreditPath from "../assets/img/credits/download.svg";
import PayCreditsPath from "../assets/img/credits/payment-icon.svg";
import History from "../assets/img/credits/history.svg";
import StatusIcon from "../assets/img/credits/loan-status.svg";
import jollibee from "../assets/img/merchants/jollibee.png";
import mcdo from "../assets/img/merchants/mcdo.png";
import amazon from "../assets/img/merchants/amazon.png";
import super8 from "../assets/img/merchants/super8.jpg";
import sm from "../assets/img/merchants/sm.png";
import walmart from "../assets/img/merchants/walmart.png";
import MerchantsSelection from "./Credits/MerchantsSelection.vue";
import { useUserStore } from "../stores/user";
import Merchants from "./merchants/Merchants.vue";
import { useRouter } from "vue-router";
const merchantEndPoint = "http://192.168.100.243:5000/api/merchant/get-all";
const router = useRouter();
let merchantData = ref([]);
let isMerchantDataFetched = ref(false); // Flag to track whether merchant data has been fetched
const userProfile = ref([]);
const creditsBalance = ref("");
const limit = ref("");
const newLimit = ref(0);
const used = ref("");
const isLoading = ref(false);
const error = ref(null);

userProfile.value = JSON.parse(localStorage.getItem("u_data"));

const creditsData = ref([]);
creditsData.value = userProfile.value.creditRequests;
getCookieUserProfileAsync("u_PRO");

const token = localStorage.getItem("a_TOK");
onMounted(async () => {
  const userStore = useUserStore();
  used.value = userProfile.value.creditsBalance;
  creditsBalance.value = userProfile.value.creditsBalance;
  sessionStorage.setItem("u_CRDBAl", JSON.stringify(userProfile.value.balance));
  limit.value = userProfile.value.limit;
  newLimit.value = limit.value - creditsBalance.value;
  sessionStorage.setItem("limit", JSON.stringify(userProfile.value.limit));
  getAllMerchant();
});

//  Get token from cookies
async function getCookieAsync(name) {
  return new Promise((resolve, reject) => {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        resolve(cookie.substring(nameEQ.length, cookie.length));
        return;
      }
    }
    resolve(null); // Return null if the cookie is not found
  });
}

async function getCookieUserProfileAsync(name) {
  try {
    const cookieValue = await getCookieAsync(name);
    if (cookieValue) {
      userProfile.value = JSON.parse(decodeURIComponent(cookieValue));
    } else {
      // console.log("userProfile cookie not found");
    }
  } catch (error) {
    console.error("Error getting token cookie:", error);
  }
}

const getAllMerchant = async () => {
  isLoading.value = true;

  try {
    const response = await fetch(merchantEndPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      merchantData.value = data.merchants;
    } else {
      const data = await response.json();
      error.value = "Failed to load merchant data";
    }
  } catch (error) {
    console.error(error);
    error.value = "An error occurred while loading data";
  } finally {
    isLoading.value = false;
  }
};

// merchantData.value = JSON.parse(localStorage.getItem("m_data"));

const balances = ref([
  {
    balanceItems: [
      {
        label: "Available balance",
        value: newLimit,
        id: 1,
        progress: true,
        max: limit,
        used: used,
      },
    ],
  },
]);
const brandDatas = ref([
  {
    name: "Security Social System",
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    name: "TwitterS",
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    name: "GithFub",
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    name: "Vimeo",
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    name: "Facebook",
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
]);

const servicesItem = ref([
  {
    id: 1,
    name: "Apply",
    path: ApplyCreditPath,
  },
  {
    id: 2,
    name: "Pay",
    path: PayCreditsPath,
  },
  {
    id: 3,
    name: "Loan Status",
    path: StatusIcon,
  },
  {
    id: 4,
    name: "History",
    path: History,
  },
]);

const merchantsGroup = ref([
  {
    name: "jollibee",
    id: 1,
    path: jollibee,
  },
  {
    name: "mcdonalds",
    id: 2,
    path: mcdo,
  },
  {
    name: "amazon",
    id: 3,
    path: amazon,
  },
  {
    name: "super8",
    id: 4,
    path: super8,
  },
  {
    name: "SM",
    id: 5,
    path: sm,
  },
  {
    name: "walmart",
    id: 6,
    path: walmart,
  },
]);
const showModal = ref(false);

const servicesFunctions = (service) => {
  switch (service.id) {
    case 1:
      applyCredit();
      break;
    case 2:
      payCredits();
      break;
    case 3:
      loanStatus();
      break;

    default:
      console.error(`Unknown service ID: ${service.id}`);
    // You could also perform some other default action here
  }
};

const applyCredit = () => {
  showModal.value = true;
};

const payCredits = () => {
  router.push({ name: "payment" });
};

const loanStatus = () => {
  router.push({ name: "loan status" });
};

const hideModal = () => {
  showModal.value = false;
};
</script>
<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Add card animations */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom scrollbar */
.scrollbar-width-thin {
  scrollbar-width: thin;
  scrollbar-color: #3d3bf3 #f1f1f1;
}

.scrollbar-width-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-width-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollbar-width-thin::-webkit-scrollbar-thumb {
  background: #3d3bf3;
  border-radius: 3px;
}

/* Responsive padding */
@media (min-width: 768px) {
  .container-credits {
    padding: 2rem;
  }
}
</style>
<template>
  <!-- Add loading overlay -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
      <svg
        class="animate-spin h-10 w-10 text-[#3D3BF3] mb-4"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span class="text-gray-700 text-lg font-medium"
        >Loading credits data...</span
      >
    </div>
  </div>

  <!-- Add error message -->
  <div v-if="error" class="mx-4 mb-4">
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    >
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>
  <template v-for="balance in balances" :key="balance.id">
    <ul class="flex flex-row justify-evenly">
      <PointsCard
        v-for="(balanceItem, index) in balance.balanceItems"
        :key="index"
        :item="balanceItem"
        :index="index"
        :credits="creditsData"
      />
    </ul>
  </template>
  <Services :services="servicesItem" @serviceClicked="servicesFunctions" />
  <div class="pb-22" v-if="merchantData">
    <Merchants :item="merchantData" />
  </div>
  <div>
    <div
      :class="{ hidden: !showModal }"
      tabindex="-1"
      class="flex bg-gray-700 bg-opacity-70 overflow-y-auto overflow-x-hidden my-auto fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="bg-white rounded-sm shadow dark:bg-gray-700 h-[40rem]">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Choose merchants
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
          </div>
          <!-- Modal body -->
          <div class="py-5 scrollbar-width-thin">
            <MerchantsSelection class="my-auto" :item="merchantData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
