<script setup>
import Swal from "sweetalert2";
import OTP from "../../components/authentications/OTP.vue";
import { ref, watch, onMounted } from "vue";
import authStore from "../../stores/auth";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const route = useRouter();
const tokenCookie = ref(null);
const otpValue = ref("");
const resendOtpTimer = ref(60); // 5 minutes timer
const userId = ref("");
let resendOtpInterval = null;
const mobileNo = ref("");
const isLoading = ref(false);
const urlSendOtp = "http://192.168.100.243:5000/api/user/send-otp";
const urlVerification = "http://192.168.100.243:5000/api/user/validate-login";
const urlProfile = "http://192.168.100.243:5000/api/user/profile";
const urlRefreshCode = "http://192.168.100.243:5000/api/user/refresh-code";

// onMounted(() => {
getCookieTokenAsync("u_TOK");
getCookieMobileAsync("u_NO");
getCookieUserIdAsync("u_ID");
// });

// ------------------------- START OF COOKIE FUNCTIONS -------------------------

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

//  Get mobile from cookies

// async function getCookieMobile(name) {
//   return new Promise((resolve, reject) => {
//     const nameEQ = name + "=";
//     const cookiesArray = document.cookie.split(";");
//     for (let i = 0; i < cookiesArray.length; i++) {
//       let cookie = cookiesArray[i].trim();
//       if (cookie.indexOf(nameEQ) === 0) {
//         resolve(cookie.substring(nameEQ.length, cookie.length));
//         return;
//       }
//     }
//     resolve(null); // Return null if the cookie is not found
//   });
// }

// SaveCookie setter
async function setCookieAsync(name, value, days) {
  return new Promise((resolve, reject) => {
    // Set the expiration date for the cookie
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    const secure = "; secure";
    // Set the cookie
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + secure + "; path=/";

    // Verify the cookie was set
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    if (
      cookieValue &&
      cookieValue.split("=")[1] === encodeURIComponent(value)
    ) {
      resolve(true); // Cookie was set successfully
    } else {
      reject(new Error("Failed to save the cookie."));
    }
  });
}

//Get Token from cookies Function
async function getCookieTokenAsync(name) {
  try {
    const cookieValue = await getCookieAsync(name);
    if (cookieValue) {
      tokenCookie.value = JSON.parse(decodeURIComponent(cookieValue));
      console.log("Token cookie value:");
    } else {
      console.log("Token cookie not found");
    }
  } catch (error) {
    console.error("Error getting token cookie:", error);
  }
}
//Get mobileNo from cookies Function
async function getCookieMobileAsync(name) {
  try {
    const cookieValue = await getCookieAsync(name);
    if (cookieValue) {
      // const mobileNos = JSON.parse(decodeURIComponent(cookieValue));
      // mobileNo.value = JSON.parse(decodeURIComponent(cookieValue));
      // console.log(mobileNos);
      mobileNo.value = JSON.parse(localStorage.getItem("mobileNo"));
      console.log(" Mobile value:");
      console.log(mobileNo.value);
    } else {
      console.log("Mobile not found");
    }
  } catch (error) {
    console.error("Error getting token cookie:", error);
  }
}
//Get userId from cookies Function
async function getCookieUserIdAsync(name) {
  try {
    const cookieValue = await getCookieAsync(name);
    if (cookieValue) {
      // userId.value = JSON.parse(decodeURIComponent(cookieValue));
      userId.value = JSON.parse(localStorage.getItem("userId"));
      console.log("UseId value:");
    } else {
      console.log("Mobile not found");
    }
  } catch (error) {
    console.error("Error getting token cookie:", error);
  }
}
// Handle save user data after authentication success
async function saveUserData(data, name) {
  try {
    const userDataString = JSON.stringify(data);

    // Attempt to save the cookie
    const success = await setCookieAsync(name, userDataString, 7);

    if (success) {
      console.log("Cookie saved successfully");
    }
  } catch (error) {
    console.error("Error saving cookie:", error);
  }
}

// ------------------------- END OF COOKIE FUNCTIONS -------------------------

// ------------------------- START OF OTP FUNCTIONS -------------------------

// Handle Start Timer Resend Otp
const startResendOtpTimer = () => {
  resendOtpInterval = setInterval(() => {
    resendOtpTimer.value--;
    // storeTimer(); // store the timer value on each tick
    if (resendOtpTimer.value === 0) {
      clearInterval(resendOtpInterval);
    }
  }, 1000);
};

//Handle resend otp
const resendOtp = async (e) => {
  isLoading.value = true; // Add this line
  try {
    getCookieMobileAsync("u_NO");
    await refreshCode();
    startResendOtpTimer();
    resendOtpTimer.value = 60;
  } catch (error) {
    console.error("Error resending OTP:", error);
  } finally {
    isLoading.value = false; // Add this line
  }
};

//Handle refresh otp
const refreshCode = async (e) => {
  try {
    const response = await fetch(urlRefreshCode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      sendOtp();
    } else {
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Handle sendOtp API integrations
const sendOtp = async (e) => {
  try {
    const response = await fetch(urlSendOtp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: JSON.stringify({
        number: mobileNo.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      // console.log(response.message);
      // console.log(data);
    } else {
      // console.log(response);
      // console.log(data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ------------------------- END OF OTP FUNCTIONS -------------------------

// ------------------------- START OF AUTH FUNCTIONS -------------------------

// Start of Get User Profile API request
// const getUserProfile = async (token) => {
//   try {
//     const response = await fetch(urlProfile, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${tokenCookie.value}`,
//       },
//     });

//     if (response.ok) {
//       const authStores = authStore();

//       // Handle data store response from API request SIGNIN
//       const data = await response.json();
//       // saveUserData(data.userProfile, "u_PRO");
//       saveUserData(token, "u_TOK");
//       authStores.login();
//       route.push("/home");
//     } else {
//       error.value = "Error fetching user profile";
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const handleRefreshCode = async (idUser) => {
  try {
    const response = await fetch(urlRefreshCode, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: idUser }),
    });

    const data = await response.json();
    // console.log(data.message);
    if (response.ok) {
      // console.log(data.message);
    } else {
      // console.log(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

//verification account
const verify = async (e) => {
  isLoading.value = true; // Add this line
  try {
    const response = await fetch(urlVerification, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secretCode: otpValue.value,
        userId: userId.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      route.push({ name: "link/passcode" });
      handleRefreshCode(userId.value);
      saveUserData(data.token, "u_TOK");
      isLoading.value = false;
    } else {
      console.log(data.message);
      Swal.fire({
        title: "Authentication failed",
        text: "Invalid code",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: `${error.message}`,
      icon: "error",
      confirmButtonText: "Ok",
    });
    console.log(error.message);
  }
};

// ------------------------- END OF AUTH FUNCTIONS -------------------------

const test = () => {
  console.log(tokenCookie.value);
  console.log(mobileNo.value);
};

watch(otpValue, (newVal) => {
  if (newVal.length === 6) {
    verify();
  }
});
startResendOtpTimer();
</script>

<template>
  <!-- Add this loading overlay -->
  <!-- Replace the existing loading overlay with this one -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
      <svg class="animate-spin h-10 w-10 text-red mb-4" viewBox="0 0 24 24">
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
      <span class="text-gray-700 text-lg font-medium">Verifying OTP</span>
      <span class="text-gray-500 text-sm mt-2"
        >Please wait while we process your request</span
      >
    </div>
  </div>
  <!-- Existing content -->
  <div class="sm:mx-auto sm:w-full sm:max-w-md my-20">
    <div class="flex justify-center mb-8">
      <img
        class="m-1 h-12 w-auto"
        src="/src/assets/img/authimages/loyaltilinx-web-favicon.png"
        alt="Loyalty Linx"
      />
      <span
        class="text-red self-center text-3xl font-extrabold whitespace-nowrap"
      >
        Loyalty Linx
      </span>
    </div>
    <h2
      class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900"
    >
      Enter the OTP
    </h2>
    <p class="mt-2 text-center text-gray-600">
      We've sent a verification code to
      <span class="font-medium">{{ mobileNo }}</span>
    </p>
  </div>
  <form action="">
    <div class="flex flex-col justify-center">
      <OTP :digit-count="6" @update:otp="otpValue = $event"></OTP>
      <!-- <p>{{ otpValue }}</p> -->
      <div class="!mt-8 flex justify-center">
        <button
          v-if="resendOtpTimer > 0"
          class="w-48 m-2 py-3 px-4 text-sm tracking-wide rounded-lg text-gray-500 bg-gray-100 font-medium focus:outline-none transition-all duration-200"
          disabled
        >
          Resend OTP ({{ resendOtpTimer }}s)
        </button>
        <button
          v-else
          class="w-48 m-2 py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-red hover:bg-rose-700 font-semibold focus:outline-none transition-all duration-200"
          @click="resendOtp"
        >
          Resend OTP
        </button>
      </div>
      <!-- <div class="!mt-2 flex justify-center">
        <button
          @click="test"
          type="submit"
          class="shadow-xl w-1/5 m-2 py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-amber-500 hover:bg-amber-600 focus:outline-none"
        >
          Verify
        </button>
      </div> -->
    </div>
  </form>
</template>
<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.bg-red {
  background-color: #ef4444;
}
</style>
