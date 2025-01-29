<script setup>
import Landing from "./views/LandingView.vue";
import login from "./views/auth/LoginView.vue";
import register from "./views/auth/RegisterView.vue";
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
const urlProfile = "http://192.168.100.243:5000/api/user/profile";
const themeUrl = "http://192.168.100.243:5000/api/theme/get/active";
const token = localStorage.getItem("a_TOK");
const data = ref(null);

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
      localStorage.setItem("u_data", JSON.stringify(data.userProfile));
    } else {
      error.value = "Error fetching user profile";
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (token) {
    // getTheme();
    getUserProfile(token);
  }
});
</script>

<template>
  <!-- <Landing msg="Loyaly Linx" /> -->

  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
