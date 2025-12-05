<template>
  <header v-if="shouldShowTopBar" class="top-bar">
    <div class="brand" @click="goToUpload" style="cursor: pointer">
      <div class="brand-title">LABELEVEN</div>
      <div class="brand-subtitle">수출용 라벨 규격 진단</div>
    </div>
    <nav class="user-links">
      <a href="#" @click.prevent="goToUser">사용자</a>
      <a href="#" @click.prevent="handleLogout">로그아웃</a>
    </nav>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const shouldShowTopBar = computed(() => {
  return route.path !== "/login" && route.path !== "/signup";
});

const goToUpload = () => {
  router.push("/upload");
};

const goToUser = () => {
  router.push("/user");
};

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  router.push("/login");
};
</script>
