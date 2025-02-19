<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import authStore from "../../stores/auth";
import { useUserStore } from "../../stores/user";
// import "intl-tel-input/build/css/intlTelInput.css";
// import intlTelInput from "intl-tel-input";

// const urlLogin = "http://192.168.100.243:5000/api/user/login";
const urlLogin = "http://192.168.100.243:5000/api/user/login/mobileNo";
const urlProfile = "http://192.168.100.243:5000/api/user/profile";

const email = ref("");
const mobileNo = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();
const generetedOtp = ref("");
// const iti = ref({});
const userStore = useUserStore();
const isLoading = ref(false);
const mobieNoInput = ref(null);

onMounted(() => {
  // intlTelInput(mobieNoInput.value, {
  //   utilsScript: "/node_modules/intl-tel-input/build/js/utils.js",
  //   containerClass: "w-full",
  //   initialCountry: "PH",
  //   strictMode: true,
  // });
});

let passwordVisible = ref(false);
const handlePasswordVisible = () => (passwordVisible.value ^= true);

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

// Usage example
async function saveUserData(data, name) {
  try {
    const userDataString = JSON.stringify(data);

    // Attempt to save the cookie
    const success = await setCookieAsync(name, userDataString, 7);

    if (success) {
      // console.log("Cookie saved successfully");
    }
  } catch (error) {
    console.error("Error saving cookie:", error);
  }
}
// test
// Start of Signin function
const handleSubmit = async (e) => {
  // e.preventDefault();
  isLoading.value = true;
  try {
    // Fetch method
    const response = await fetch(urlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobileNo: mobileNo.value,
        role: "user",
      }),
    });

    // Handle data store response from API request SIGNIN
    const data = await response.json();
    if (response.ok) {
      router.push({ name: "link/passcode" });
      generetedOtp.value = generatedToken();
      // sessionStorage.setItem("mobileNo", mobileNo.value);
      saveUserData(data.userId, "u_ID");
      saveUserData(mobileNo.value, "u_NO");
      saveUserData(data.token, "u_TOK");
      localStorage.setItem("mobileNo", JSON.stringify(mobileNo.value));
      localStorage.setItem("userId", JSON.stringify(data.userId, "u_ID"));
      // router.push({
      //   path: "/verification",
      //   query: { gen: generetedOtp.value },
      // });
      isLoading.value = false;
      return data;
    } else {
      isLoading.value = false;
      error.value = data.message;
      // console.log(data.message);
    }
  } catch (error) {
    isLoading.value = false;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      error.value = `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // The request was made but no response was received
      error.value = "No response received from the server";
    } else {
      // Something happened in setting up the request that triggered an Error
      error.value = "Error setting up the request";
    }
  }
};

// End of Get User Profile API request

const generatedToken = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const tokenLength = 18; // adjust the length of the token as needed
  let token = "";

  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
};

// Validation mobile number
const validateMobileNo = () => {
  const mobileNumber = mobileNo.value.replace(/\s+/g, ""); // remove all spaces
  mobileNo.value = mobileNumber;
  handleSubmit();
};
</script>

<template>
  <!-- Add this loading overlay at the top of the template -->
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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
      <span class="text-gray-700 text-lg font-medium">Logging in...</span>
      <span class="text-gray-500 text-sm mt-2"
        >Please wait while we verify your credentials</span
      >
    </div>
  </div>
  <div class="font-[sans-serif]">
    <div
      class="min-h-screen py-6 px-1 sm:flex sm:justify-center sm:item-center"
    >
      <div
        class="grid mt-26 sm:mt-0 md:grid-cols-2 items-center gap-4 max-w-6xl w-full"
      >
        <div
          class="border mx-auto w-full border-none shadow-none px-10 border-gray-300 rounded-lg p-6 max-w-sm sm:w-full sm:border sm:shadow-2"
        >
          <form class="space-y-4" @submit.prevent="validateMobileNo">
            <div class="flex justify-center mb-10">
              <img
                class="m-1 h-12 w-auto"
                src="/src/assets/img/authimages/loyaltilinx-web-favicon.png"
                alt="Workflow"
              />
              <span
                style="font-family: poppins"
                class="text-red self-center text-3xl font-extrabold whitespace-nowrap dark:text-white"
                >Loyalty Linx</span
              >
            </div>

            <div>
              <div>
                <label
                  for="mobieNo"
                  class="mt-6 block text-sm font-medium leading-5 text-gray-700"
                  >Mobile No</label
                >
                <div
                  id="mobileNoCon"
                  class="mt-1 relative rounded-md shadow-sm"
                >
                  <vue-tel-input
                    inputmode="numeric"
                    pattern="[0-9]*"
                    :inputOptions="{
                      maxlength: 11,
                    }"
                    required
                    v-model="mobileNo"
                    class="border border-gray-300 p-1 focus:border-amber-500 focus:ring-amber-500"
                  ></vue-tel-input>
                  <div
                    class="hidden absolute inset-y-0 right-0 pr-3 items-center pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <p style="font-size: 0.7rem; color: red" v-if="error">
              {{ error }}
            </p>

            <div
              class="flex flex-wrap items-center justify-between gap-4"
            ></div>

            <div class="!mt-8">
              <button
                type="submit"
                class="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-red hover:bg-rose-700 focus:outline-none transition-all duration-200"
                :disabled="isLoading"
              >
                <template v-if="isLoading">
                  <svg
                    class="animate-spin h-5 w-5 mr-3 inline"
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
                  Processing...
                </template>
                <template v-else> Submit </template>
              </button>
            </div>

            <div class="mt-7 flex flex-col gap-2">
              <div></div>
            </div>
            <p class="text-sm !mt-8 text-center text-gray-800">
              Don't have an account
              <RouterLink
                to="/register"
                class="text-amber-500 font-semibold hover:underline ml-1 whitespace-nowrap"
                >Register here</RouterLink
              >
            </p>
          </form>
        </div>
        <div id="image" class="lg:h-[400px] md:h-[300px] max-md:mt-8">
          <img
            src="../../assets/img/authimages/login-image.jpg"
            class="w-full h-full max-md:w-4/5 mx-auto block object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
input:focus {
  border: none;
  box-shadow: none;
}

#mobieNo:focus {
  border: 1px #ffb300 solid;
  box-shadow: none;
}

.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  #image {
    display: none;
  }
}
</style>
