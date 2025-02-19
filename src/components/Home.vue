<script setup>
import { ref, onMounted, computed } from "vue";
import { initTabs } from "flowbite";

import { initModals } from "flowbite";
import { defineEmits } from "vue";
import HomeCarousel from "./HomeCard/HomeCarousel.vue";
import HomeCarousel2 from "./HomeCard/HomeCarousel2.vue";
import Services from "./HomeCard/Services.vue";
import ApplyCreditPath from "../assets/img/credits/download.svg";
import PayCreditsPath from "../assets/img/credits/payment-icon.svg";
import CovertPointsPath from "../assets/img/credits/convert.svg";
import RedeemPath from "../assets/img/credits/redeem.svg";
import DiscoverDealsPath from "../assets/img/credits/discover.svg";
import MorePath from "../assets/img/home/more-horizontal-svgrepo-com.svg";
import HistoryTable from "./HomeCard/HistoryTable.vue";
import Card from "./HomeCard/Card.vue";
import TransactionHistoryModal from "./modal/TransactionHistoryModal.vue";
import MerchantsSelection from "./Credits/MerchantsSelection.vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
const router = useRouter();
let merchantData = ref([]);
const historyEndPoint =
  "http://192.168.100.243:5000/api/transactions/get-user-transactions";
const merchantEndPoint = "http://192.168.100.243:5000/api/merchant/get-all";
const userData = JSON.parse(localStorage.getItem("u_data"));
const creditAmount = userData.balance;
const token = localStorage.getItem("a_TOK");
const creditsHistory = ref([]);
const pointsHistory = ref([]);
const transactionsHistory = ref([]);
creditsHistory.value = userData.transactionHistory;
const data = ref(null);
const allowedTransactionTypes = ["credit_applied", "refund", "substract"];
const allowedTransactionTypesPoints = ["points add", "redeem"];
const themeUrl = "http://192.168.100.243:5000/api/theme/get/active";
const isLoading = ref(false);
const error = ref(null);

const handleGetHistory = async () => {
  isLoading.value = true;

  try {
    const response = await fetch(historyEndPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token} `,
      },
    });

    const data = await response.json();
    if (response.ok) {
      let creditHistroyData = data.transactions.filter((item) =>
        allowedTransactionTypes.includes(item.transactionType)
      );
      let pointsHistroyData = data.transactions.filter((item) =>
        allowedTransactionTypesPoints.includes(item.transactionType)
      );
      creditsHistory.value = creditHistroyData;
      pointsHistory.value = pointsHistroyData;
    }
  } catch (error) {
    console.error(error);
    error.value = "An error occurred while loading data";
  } finally {
    isLoading.value = false;
  }
};

const formattedCreditAmount = computed(() => {
  return new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(creditAmount);
});
const formattedPointsAmount = computed(() => {
  return new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(userData.pointsBalance);
});

const balancesCredits = ref([
  {
    name: "Current credits history",
    label: "Available credits",
    value: formattedCreditAmount,
    id: 1,
  },
]);

const balancesPoints = ref([
  {
    name: "Points earned history",
    label: "Available points",
    value: formattedPointsAmount,
    id: 2,
  },
]);

const servicesItem = ref([
  {
    id: 1,
    name: "Apply Credit",
    path: ApplyCreditPath,
  },
  {
    id: 2,
    name: "Pay Credits",
    path: PayCreditsPath,
  },
  {
    id: 3,
    name: "Convert Points",
    path: CovertPointsPath,
  },
  {
    id: 4,
    name: "Redeem",
    path: RedeemPath,
  },
  {
    id: 5,
    name: "Discover Deals",
    path: DiscoverDealsPath,
  },
  {
    id: 6,
    name: "more",
    path: MorePath,
  },
]);

const props = {
  item: Object,
  index: Number,
  history: Array,
};
const showModal = ref(false);

const unHide = (service) => {
  switch (service.id) {
    case 1:
      applyCredit();
      break;
    case 2:
      payCredits();
      break;
    case 3:
      convertPoints();
      break;
    case 4:
      redeem();
      break;
    case 5:
      discoverDeals();
      break;
    case 6:
      more();
      break;
    default:
      console.error(`Unknown service ID: ${service.id}`);
    // You could also perform some other default action here
  }
};
const applyCredit = () => {
  // Code for applying credit
  showModal.value = true;

  console.log("Applying credit...");
};

const payCredits = () => {
  // Code for paying credits
  router.push({ name: "payment" });
  console.log("Paying credits...");
};

const convertPoints = () => {
  // Code for converting points
  console.log("Converting points...");
};

const redeem = () => {
  // Code for redeeming
  router.push({ name: "product/list" });
  console.log("Redeeming...");
};

const discoverDeals = () => {
  // Code for discovering deals
  console.log("Discovering deals...");
};

const more = () => {
  // Code for more
  console.log("Showing more...");
};

const getAllMerchant = async (token) => {
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
      // console.log(merchantData.value);
      localStorage.setItem("m_data", JSON.stringify(data.merchants));
    } else {
      const data = await response.json();
      console.log(data);
    }
  } catch (error) {
    console.groupEnd(error);
  }
};
const hideModal = () => {
  showModal.value = false;
};
const theme = ref(null);
if (localStorage.getItem("theme")) {
  theme.value = JSON.parse(localStorage.getItem("theme"));
}
const getTheme = async () => {
  try {
    const response = await fetch(themeUrl);
    const themeData = await response.json(); // Replace with your API endpoint
    data.value = themeData;
    localStorage.setItem("theme", JSON.stringify(themeData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const updateTabColors = () => {
  if (theme.value) {
    const root = document.documentElement;

    // Update CSS variables dynamically
    root.style.setProperty(
      "--tab-active-bg",
      theme.value.backgroundColor || "#3D3BF3"
    );
    root.style.setProperty(
      "--tab-inactive-text",
      theme.value.tabInactiveText || "#AAAAAA"
    );
  }
};
onMounted(async () => {
  getTheme();
  const userStore = useUserStore();
  const token = userStore.token;
  await getAllMerchant(token);
  initTabs();
  updateTabColors();
  handleGetHistory();
});
</script>

<template>
  <!-- Add this at the top of template -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
      <svg
        class="animate-spin h-10 w-10 text-[var(--tab-active-bg)] mb-4"
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
        >Loading your dashboard...</span
      >
    </div>
  </div>

  <!-- Add error message -->
  <div v-if="error" class="mx-3 mb-4">
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    >
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </div>

  <div class="container-services">
    <!-- <ul
      id="homeCard"
      class="bg-white mx-3 pb-6 rounded-sm flex flex-row justify-evenly"
    > -->
    <ul id="homeCard" class="rounded-sm flex flex-row justify-evenly">
      <div
        id="tab-options"
        class="border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto"
      >
        <ul
          class="flex flex-wrap flex-row -mb-px text-sm font-medium text-center w-full"
          id="default-styled-tab"
          data-tabs-toggle="#default-styled-tab-content"
          data-tabs-active-classes="text-white bg-[var(--tab-active-bg)] hover:text-red border-transparent dark:border-[var(--tab-active-bg)]"
          data-tabs-inactive-classes="dark:border-transparent bg-white text-gray-500 hover:text-red dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"
          role="tablist"
        >
          <li class="w-1/2" role="presentation">
            <button
              class="w-full p-4 border-b-2 rounded-t-lg m-0 hover:border-gray-300 dark:hover:text-gray-300"
              id="profile-styled-tab"
              data-tabs-target="#styled-profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
            >
              <h2 class="font-bold">Credits</h2>
            </button>
          </li>
          <li class="w-1/2" role="presentation">
            <button
              class="w-full p-4 border-b-2 rounded-t-lg m-0 hover:border-gray-300 dark:hover:text-gray-300"
              id="dashboard-styled-tab"
              data-tabs-target="#styled-dashboard"
              type="button"
              role="tab"
              aria-controls="dashboard"
              aria-selected="false"
            >
              <h2 class="font-bold">Points</h2>
            </button>
          </li>
        </ul>
      </div>
      <div id="tab-contents" class="w-full max-w-md mx-auto">
        <div
          class="hidden dark:bg-gray-800"
          id="styled-profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
          <template v-for="balance in balancesCredits" :key="balance.id">
            <div
              class="mx-auto justify-center rounded-2xl items-center flex flex-col"
            >
              <Card
                v-for="(balanceItem, index) in balancesCredits"
                :key="index"
                :item="balanceItem"
                :index="index"
                :history="creditsHistory"
              />

              <div class="w-full flex flex-row">
                <HistoryTable id="table" :history="creditsHistory" />
              </div>
            </div>
          </template>
        </div>
        <div
          class="hidden dark:bg-gray-800"
          id="styled-dashboard"
          role="tabpanel"
          aria-labelledby="dashboard-tab"
        >
          <template v-for="history in balancesPoints" :key="history.name">
            <div class="mx-auto justify-center items-center flex flex-col">
              <Card
                v-for="(balancePoint, index) in balancesPoints"
                :key="index"
                :item="balancePoint"
                :index="index"
                :history="pointsHistory"
              />
              <div class="w-full flex flex-row">
                <HistoryTable id="table" :history="creditsHistory" />
              </div>
            </div>
          </template>
        </div>
      </div>
      <template v-for="balance in balancesCredits" :key="balance.id">
        <div
          id="container"
          class="px-2 justify-center items-center flex flex-col mt-3"
        >
          <Card
            v-for="(balanceItem, index) in balancesCredits"
            :key="index"
            :item="balanceItem"
            :index="index"
            :history="creditsHistory"
          />

          <div class="w-full flex flex-row">
            <HistoryTable id="table" :history="creditsHistory" />
          </div>
        </div>
      </template>
      <div id="vertical" class="border mt-4"></div>
      <template v-for="history in balancesPoints" :key="history.name">
        <div
          id="container"
          class="px-2 justify-center rounded-2xl items-center flex flex-col mt-3"
        >
          <Card
            v-for="(balancePoint, index) in balancesPoints"
            :key="index"
            :item="balancePoint"
            :index="index"
            :history="creditsHistory"
          />
          <div class="w-full flex flex-row">
            <HistoryTable id="table" :history="creditsHistory" />
          </div>
        </div>
      </template>
    </ul>
    <Services :services="servicesItem" @serviceClicked="unHide" />
    <!-- <TransactionHistoryModal /> -->

    <div class="mx-3">
      <HomeCarousel />
    </div>
    <div class="mx-3">
      <HomeCarousel2 />
    </div>
  </div>
  <div class="h-[4rem]"></div>
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

<style>
:root {
  --tab-active-bg: #3d3bf3; /* Default active tab background color */
  --tab-inactive-text: #gray; /* Default inactive tab text color */
}

.dark {
  --tab-active-bg: #1a1a2e; /* Active tab background color in dark mode */
  --tab-inactive-text: #aaaaaa; /* Inactive text color in dark mode */
}

#default-styled-tab {
  width: 100%;
  justify-content: space-between;
  gap: 0;
}

#default-styled-tab li {
  flex: 1;
}

#default-styled-tab button {
  width: 100%;
  text-align: center;
}

@media (max-width: 1550px) {
  #carousel {
    margin: auto;
    width: 85%;
  }
}
@media (min-width: 1100px) {
  .container-services {
    padding: 0rem 8rem;
  }
}
@media (max-width: 995px) {
  #vertical {
    display: none;
  }
}
@media (max-width: 690px) {
  #homeCard {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #container {
    width: 90%;
    display: none;
  }
}
@media (min-width: 690px) {
  #tab-options {
    display: none;
  }
  #tab-contents {
    display: none;
  }
}
/* Add smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Improve tab styling */
#default-styled-tab button {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

#default-styled-tab button::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--tab-active-bg);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

#default-styled-tab button:hover::after {
  width: 100%;
}

/* Add card hover effects */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Improve modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Update responsive styles */
@media (max-width: 690px) {
  .container-services {
    padding: 1rem;
  }

  #homeCard {
    margin: 0;
    padding: 0;
  }
}

/* Add custom scrollbar */
.scrollbar-width-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--tab-active-bg) #f1f1f1;
}

.scrollbar-width-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-width-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollbar-width-thin::-webkit-scrollbar-thumb {
  background: var(--tab-active-bg);
  border-radius: 3px;
}
</style>
