<script setup>
import { ref } from "vue";
import PointsCard from "../components/PointsCard/PointsCard.vue";
import PointsHistory from "./PointsCard/PointsHistory.vue";
import Services from "./HomeCard/Services.vue";
import ConvertPath from "../assets/img/credits/convert.svg";
import RedeemPath from "../assets/img/credits/redeem.svg";
import ShopPath from "../assets/img/credits/shop.svg";
import History from "../assets/img/credits/history.svg";
import { useRouter } from "vue-router";

const props = defineProps(["item", "index"]);
const userData = JSON.parse(localStorage.getItem("u_data"));

const router = useRouter();
const pointsBalance = ref(0);
pointsBalance.value = userData.pointsBalance;

const balances = ref([
  {
    balanceItems: [
      {
        label: "Available points",
        value: pointsBalance,
        id: 2,
      },
    ],
  },
]);
const servicesItem = ref([
  {
    id: 1,
    name: "Convert",
    path: ConvertPath,
  },
  {
    id: 2,
    name: "Redeem ",
    path: RedeemPath,
  },
  {
    id: 3,
    name: "Shop",
    path: ShopPath,
  },
  {
    id: 4,
    name: "History",
    path: History,
  },
]);

const creditsHistory = ref([]);
creditsHistory.value = userData.transactionHistory;

const brandDatas = ref([
  {
    name: "Purchase",
    points: 3.5,
    dateAndTime: "August 2, 2024 : 09:42 p.m",
    action: "Chatime (Down Town Market) ",
  },
  {
    name: "Purchase",
    points: 2.2,
    dateAndTime: "August 2, 2024 : 08:27 p.m",
    action: "Chatime (Down Town Market)",
  },
  {
    name: "Purchase",
    points: 2.1,
    dateAndTime: "August 4, 2024 : 06:34 a.m",
    action: "Bearbrand (1.5 liter)",
  },
  {
    name: "Purchase",
    points: 1.5,
    dateAndTime: "July 18, 2024 : 07:12 a.m",
    action: "Chicken Nuggets (Pure Foods)",
  },
  {
    name: "Purchase",
    points: 3.5,
    dateAndTime: "August 5, 2024 : 12:00 p.m",
    action: "Sleepers (SM)",
  },
  {
    name: "Purchase",
    points: 3.5,
    dateAndTime: "June 19, 2024 : 02:27 p.m",
    action: "Hotdog (7/11)",
  },
  {
    name: "Redemption",
    points: 3.5,
    dateAndTime: "July 21, 2024 : 05:42 a.m",
    action: "From Groceries",
  },
  {
    name: "Purchase",
    points: 3.5,
    dateAndTime: "August 4, 2024 : 10:21 p.m",
    action: "Keyboard (SM)",
  },
]);

const servicesFunctions = (service) => {
  switch (service.id) {
    case 1:
      convert();
      break;
    case 2:
      redeem();
      break;
    case 3:
      shop();
      break;

    default:
      console.error(`Unknown service ID: ${service.id}`);
    // You could also perform some other default action here
  }
};

const convert = () => {
  console.log("Converting....");
};
const redeem = () => {
  console.log("Redeem....");
  router.push({ name: "product/list" });
};
const shop = () => {
  console.log("Go to shop.....");
  router.push({ name: "product/list" });
};
</script>

<template>
  <div class="points-container">
    <template v-for="balance in balances" :key="balance.id">
      <div class="scroll-container">
        <!-- Points Card Section -->
        <div class="max-w-md mx-auto w-full px-4">
          <ul class="flex flex-row justify-center">
            <PointsCard
              v-for="(balanceItem, index) in balance.balanceItems"
              :key="index"
              :item="balanceItem"
              :index="index"
              class="w-full"
            />
          </ul>
        </div>

        <!-- Services and History Section -->
        <div class="services-history-container max-w-4xl mx-auto px-4 mt-6">
          <Services
            :services="servicesItem"
            @serviceClicked="servicesFunctions"
            class="mb-6"
          />
          <div class="history-container">
            <PointsHistory :brands="creditsHistory" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
.scroll-container {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scroll-container::-webkit-scrollbar {
  display: none; /* WebKit-based browsers */
}

#services-container {
  margin: 0rem 1.1rem;
}
.points-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.services-history-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.history-container {
  padding-bottom: 6rem;
}

@media (min-width: 1100px) {
  .scroll-container {
    padding: 2rem 8rem;
  }
  
  .services-history-container {
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .scroll-container {
    padding: 1rem;
  }
  
  .services-history-container {
    padding: 1rem;
    margin: 0;
  }
}
</style>
