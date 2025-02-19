<script setup>
import { ref } from "vue";
import otpPassocode from "../../components/registration/otpPassocode.vue";
import { useRouter } from "vue-router";
import authStore from "../../stores/auth";
import { useUserStore } from "../../stores/user";

const otpValue = ref("");
const router = useRouter();
const error = ref(null);
const tokenCookie = ref(null);
const userId = ref("");
const userProfile = ref([]);
const isLoading = ref(false);
userProfile.value = JSON.parse(localStorage.getItem("u_data"));

const loginPasscode =
  "https://loyalty-linxapi-eight.vercel.app/api/user/passcode";
const urlProfile = "https://loyalty-linxapi-eight.vercel.app/api/user/profile";
const urlRefreshCode =
  "https://loyalty-linxapi-eight.vercel.app/api/user/refresh-code";
const themeUrl =
  "https://loyalty-linxapi-eight.vercel.app/api/theme/get/active";
const userStore = useUserStore();

getCookieTokenAsync("u_TOK");
getCookieUserIdAsync("u_ID");
// getCookieProfileAsync("u_PRO");

// SaveCookie setter
// async function setCookieAsync(name, value, days) {
//   return new Promise((resolve, reject) => {
//     // Set the expiration date for the cookie
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     const expires = "; expires=" + date.toUTCString();
//     const secure = "; secure";
//     // Set the cookie
//     document.cookie =
//       name + "=" + encodeURIComponent(value) + expires + secure + "; path=/";

//     // Verify the cookie was set
//     const cookieValue = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith(name + "="));
//     if (
//       cookieValue &&
//       cookieValue.split("=")[1] === encodeURIComponent(value)
//     ) {
//       resolve(true); // Cookie was set successfully
//     } else {
//       reject(new Error("Failed to save the cookie."));
//     }
//   });
// }
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
//Get Token from cookies Function
async function getCookieTokenAsync(name) {
  try {
    const cookieValue = await getCookieAsync(name);
    if (cookieValue) {
      tokenCookie.value = JSON.parse(decodeURIComponent(cookieValue));
      // console.log("Token cookie value: ", tokenCookie.value);
    } else {
      // console.log("Token cookie not found");
    }
  } catch (error) {
    console.error("Error getting token cookie:", error);
  }
}
//Get Token from cookies Function
// async function getCookieProfileAsync(name) {
//   try {
//     const cookieValue = await getCookieAsync(name);
//     if (cookieValue) {
//       userProfile.value = JSON.parse(decodeURIComponent(cookieValue));
//       // console.log("Token cookie value: ", userProfile.value);
//     } else {
//       // console.log("Token cookie not found");
//     }
//   } catch (error) {
//     console.error("Error getting token cookie:", error);
//   }
// }

async function getCookieUserIdAsync(name) {
  try {
    const cookieValue = await getCookieAsync(name);
    if (cookieValue) {
      userId.value = JSON.parse(decodeURIComponent(cookieValue));
      // console.log(" Mobile value:");
    } else {
      // console.log("Mobile not found");
    }
  } catch (error) {
    console.error("Error getting token cookie:", error);
  }
}
// const createPassCode = () => {
//   sessionStorage.setItem("passCode", JSON.stringify(otpValue.value));
//   router.push({ name: "confirmpasscode" });
// };

// async function saveUserData(data, name) {
//   try {
//     const userDataString = JSON.stringify(data, (key, value) => {
//       if (typeof value === "object" && value !== null) {
//         return JSON.stringify(value); // recursively serialize nested objects
//       }
//       return value;
//     });

//     // Attempt to save the cookie
//     const success = await setCookieAsync(name, userDataString, 7);
//     if (success) {
//       // console.log("Cookie saved successfully");
//     }
//   } catch (error) {
//     console.error("Error saving cookie:", error);
//   }
// }
// const userDataString = JSON.stringify(data, (key, value) => {
//   if (typeof value === 'object' && value !== null) {
//     return JSON.stringify(value); // recursively serialize nested objects
//   }
//   return value;
// });
// Start of Get User Profile API request
const getUserProfile = async (token) => {
  try {
    const response = await fetch(urlProfile, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      const authStores = authStore();

      const userProfile = data.userProfile;
      const dataUser = {
        ...userProfile,
        creditRequests: undefined,
        credits: undefined,
        fullAddress: undefined,
        verification: undefined,
        cart: undefined,
      };

      const credReq = data.userProfile.creditRequests;

      const mappedCredReq = credReq.map((item) => {
        return { ...item, paymentLog: undefined };
      });

      const mappedCred = credReq.map((item) => {
        return { ...item, paymentLog: undefined };
      });

      const mappedPaymentLog = credReq.map((item) => {
        return item.paymentLog;
      });

      saveUserData(mappedPaymentLog, "userPaymentLog");
      saveUserData(mappedCred, "userCred");
      saveUserData(mappedCredReq, "u_CREDREQ");
      saveUserData(dataUser, "u_PRO");
      // handleRefreshCode(data.userProfile._id);
      sessionStorage.setItem(
        "u_CRDBAl",
        JSON.stringify(data.userProfile.balance.toString())
      );
      localStorage.setItem("u_data", JSON.stringify(data.userProfile));
      localStorage.setItem("qrCode", JSON.stringify(data.userProfile.qrCode));
      userStore.setToken(token);
      authStores.login(token);
      router.replace("/home");
    } else {
      error.value = "Error fetching user profile";
    }
  } catch (error) {
    console.log(error);
  }
};

//Handle refresh secret code
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
const handleSignIn = async () => {
  // console.log(tokenCookie.value);
  isLoading.value = true;
  try {
    const response = await fetch(loginPasscode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCookie.value}`,
      },
      body: JSON.stringify({
        password: otpValue.value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      getTheme();
      if (!userProfile.value || userProfile.value.length === 0) {
        await getUserProfile(tokenCookie.value);
      } else {
        router.push({ name: "home" });
        isLoading.value = false;
      }
    } else {
      isLoading.value = false;
      error.value = data.message;
    }
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};
</script>

<template>
  <!-- Add this loading overlay at the top of the template -->
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
      <span class="text-gray-700 text-lg font-medium">Verifying Passcode</span>
      <span class="text-gray-500 text-sm mt-2"
        >Please wait while we process your request</span
      >
    </div>
  </div>
  <div class="px-4">
    <div class="p-4 mt-10">
      <div class="flex flex-col space-y-2">
        <div v-if="userProfile" class="flex items-center">
          <img
            class="h-8 w-8 rounded-full mr-2"
            :src="
              userProfile.profileImage ||
              '/src/assets/img/authimages/default-avatar.png'
            "
            alt="Profile"
          />
          <h1 class="font-semibold text-gray-800 text-xl">
            Hi! {{ userProfile.firstName }}
          </h1>
        </div>
        <h1 class="text-gray-800 font-bold text-2xl">Enter your passcode</h1>
        <p class="text-gray-500 text-sm">
          Please enter your 6-digit passcode to continue
        </p>
      </div>
    </div>
    <div class="flex flex-col justify-between">
      <form @submit.prevent="handleSignIn">
        <div id="otp-input " class="mt-15">
          <otpPassocode
            :digit-count="6"
            @update:otp="otpValue = $event"
          ></otpPassocode>
        </div>
        <div class="flex justify-between items-center">
          <div class="px-4 py-5">
            <p v-if="error" class="text-red-500 text-sm font-medium">
              {{ error }}
            </p>
          </div>
          <div class="text-sm px-2 py-2">
            <router-link to="/forgotpassword">
              <p
                @click="generateOtpTokens"
                class="text-[#3D3BF3] text-sm hover:text-[#4635B1] hover:underline font-semibold cursor-pointer transition-colors duration-200"
              >
                Forgot your passcode?
              </p>
            </router-link>
          </div>
        </div>
        <div>
          <div class="mt-[90%]">
            <span class="block w-full rounded-md shadow-sm">
              <button
                @click="createPassCode"
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-[#3D3BF3] hover:bg-[#4635B1] focus:outline-none focus:border-[#4635B1] focus:shadow-outline-indigo active:bg-[#4635B1] transition duration-150 ease-in-out"
                :disabled="isLoading"
              >
                <template v-if="isLoading">
                  <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                  Processing...
                </template>
                <template v-else> Next </template>
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.hover\:underline:hover {
  text-decoration: underline;
}
</style>
