<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

// Retrieve loan monitor data from session storage
const loanMonitor =
  JSON.parse(sessionStorage.getItem("loanMonitorStatus")) || {};
const {
  monthlyInstallment,
  merchantLogo,
  merchantName,
  paymentLog = [],
} = loanMonitor;

// Computed property for formatted monthly installment
const formattedCreditAmount = computed(() =>
  new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(monthlyInstallment)
);

// Get unpaid payments and the nearest unpaid date
const today = new Date();
const unpaidPayments = paymentLog.filter((item) => item.status === "unpaid");
const nearestUnpaidPayment = unpaidPayments.reduce(
  (min, current) => {
    const diff = Math.abs(today - new Date(current.paymentDate));
    return diff < min.diff ? { diff, paymentDate: current.paymentDate } : min;
  },
  { diff: Infinity, paymentDate: null }
);

// Computed property for formatted due date
const formattedDueDate = computed(() =>
  nearestUnpaidPayment.paymentDate
    ? new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(nearestUnpaidPayment.paymentDate))
    : "No unpaid payments"
);

// Navigate back
const handleBack = () => {
  router.back();
};

// Formatting methods
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
</script>

<template>
  <div class="px-2">
    <!-- Back Button -->
    <div class="flex items-center py-3">
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
    </div>

    <!-- Loan Monitor Details -->
    <div class="text-center text-neutral-900 bg-white py-6 rounded-sm">
      <div class="flex justify-center items-center">
        <div class="w-15 mr-4">
          <img :src="merchantLogo" alt="Merchant Logo" class="max-w-full" />
        </div>
        <h2 class="text-2xl font-semibold">{{ merchantName }}</h2>
      </div>

      <div class="border border-gray-400 m-2"></div>

      <div class="mt-10 text-sm">
        <h2>NEXT PAYMENT DUE</h2>
        <h1 class="text-xl font-medium">{{ formattedCreditAmount }}</h1>
      </div>

      <div class="mt-10 text-sm">
        <h2>DUE DATE</h2>
        <h1 class="text-xl">{{ formattedDueDate }}</h1>
      </div>
    </div>

    <!-- Payment Log Table -->
    <div class="relative overflow-x-auto mb-4 px-5">
      <table class="w-full text-sm text-center">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
          <tr>
            <th class="px-6 py-3">Month</th>
            <th class="px-6 py-3">Pay Date</th>
            <th class="px-6 py-3">Amount Due</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paymentLog" :key="index" class="bg-white">
            <td class="px-4 py-4">
              <div class="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  class="w-4"
                >
                  <path
                    d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50
                      l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z"
                    :fill="item.status === 'unpaid' ? '#ccc' : '#43a047'"
                  />
                </svg>
                <p>{{ index + 1 }}</p>
              </div>
            </td>
            <td>{{ formatDate(item.paymentDate) }}</td>
            <td>{{ formatCurrency(item.paymentAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
