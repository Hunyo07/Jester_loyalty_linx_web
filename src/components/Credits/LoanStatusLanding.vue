<script setup>
import { ref, computed, onMounted } from "vue";
import LoanStatus from "./LoanStatus.vue";
import Filter from "../FilterComponent/Filter.vue";
import { useRouter } from "vue-router";

// Router setup
const router = useRouter();

// State variables
const creditsData = ref([]);
const merchantsFilter = ref("all");
const statusFilter = ref("all");
const selectedOption = ref("");

// Fetch user data from localStorage
const userData = JSON.parse(localStorage.getItem("u_data"));
creditsData.value = userData?.creditRequests || [];

// Compute merchant options
const merchantOptions = computed(() => {
  const uniqueMerchants = new Set(
    creditsData.value.map((credit) => credit.merchantName)
  );
  return ["all", ...uniqueMerchants];
});

// Filtered credits
const filteredCredits = computed(() => {
  let filtered = creditsData.value;

  if (statusFilter.value !== "all") {
    filtered = filtered.filter((item) => item.status === statusFilter.value);
  }

  if (merchantsFilter.value !== "all") {
    filtered = filtered.filter(
      (item) => item.merchantName === merchantsFilter.value
    );
  }

  return filtered;
});

// Update status filter
function updateSelectedOption(option) {
  selectedOption.value = option;
  statusFilter.value = option;
}

// Update merchants filter
function updateMerchantsFilter(option) {
  merchantsFilter.value = option;
}

// Handle unpaid statuses on mount
onMounted(() => {
  creditsData.value.forEach((credit) => {
    const unpaidLogs = credit.paymentLog?.filter(
      (log) => log.status === "unpaid"
    );
    credit.nearestUnpaidDate = unpaidLogs?.length
      ? getNearestDate(unpaidLogs)
      : null;
  });
});

// Helper to find the nearest unpaid date
function getNearestDate(paymentLogs) {
  return paymentLogs.reduce(
    (nearest, log) => {
      const diff = Math.abs(new Date() - new Date(log.paymentDate));
      return diff < nearest.diff
        ? { diff, paymentDate: log.paymentDate }
        : nearest;
    },
    { diff: Infinity, paymentDate: null }
  ).paymentDate;
}

// Handle loan status navigation
function handleLoanStatus(item) {
  if (item.status === "approved") {
    sessionStorage.setItem("loanMonitorStatus", JSON.stringify(item));
    router.push({ name: "loan details" });
  } else {
    console.log("Your request is not approved yet.");
  }
}

// Navigate back
function handleBack() {
  router.back();
}
</script>

<template>
  <div class="px-2">
    <div class="flex justify-between items-center py-3">
      <!-- Back Button -->
      <button
        @click="handleBack"
        class="flex items-center gap-2 text-gray-700 bg-white border hover:bg-gray-300 px-3 py-1 rounded-md shadow-sm"
      >
        <svg
          fill="currentColor"
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M10.828 12l4.95-4.95-1.414-1.414L7 12l7.364 7.364 1.414-1.414z"
          />
        </svg>
        Back
      </button>

      <!-- Status Filter -->
      <Filter
        :options="['all', 'approved', 'pending', 'rejected']"
        :selectedOption="selectedOption"
        @update:selectedOption="updateSelectedOption"
      />

      <!-- Merchant Filter -->
      <Filter
        :options="merchantOptions"
        :selectedOption="merchantsFilter"
        @update:selectedOption="updateMerchantsFilter"
      />
    </div>

    <!-- Credit Items -->
    <div v-if="filteredCredits.length > 0">
      <div
        v-for="(item, index) in filteredCredits"
        :key="index"
        @click="handleLoanStatus(item)"
        class="my-2 p-4 bg-white border rounded-md shadow hover:bg-gray-100"
      >
        <div class="flex items-center justify-between">
          <!-- Merchant Info -->
          <div class="flex items-center gap-4">
            <img
              class="w-20 rounded"
              :src="item.merchantLogo"
              alt="Merchant Logo"
            />
            <div>
              <h5 class="text-lg font-bold">{{ item.merchantName }}</h5>
              <p class="text-sm text-gray-500">
                {{
                  item.status === "approved" ? "Due Payment" : "Credit Amount"
                }}
              </p>
              <p class="text-xl font-semibold">
                {{
                  new Intl.NumberFormat("en-PH", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                  }).format(
                    item.status === "approved"
                      ? item.monthlyInstallment
                      : item.creditAmount
                  )
                }}
              </p>
            </div>
          </div>

          <!-- Status & Date -->
          <div class="text-right">
            <span
              class="inline-block px-2 py-1 rounded text-sm"
              :class="{
                'bg-green-300 text-green-800': item.status === 'approved',
                'bg-amber-500 text-white': item.status !== 'approved',
              }"
            >
              {{ item.status }}
            </span>
            <p v-if="item.nearestUnpaidDate" class="mt-2 text-sm text-gray-500">
              Pay on:
              {{
                new Intl.DateTimeFormat("en-PH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(item.nearestUnpaidDate))
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Records -->
    <div v-else class="text-center mt-10 text-gray-600">
      <p>No records found</p>
    </div>
  </div>
</template>
