<template>
  <header class="top-bar">
    <div class="brand" @click="goToUpload" style="cursor: pointer">
      <div class="brand-title">LabeLable</div>
      <div class="brand-subtitle">수출용 라벨 규격 진단</div>
    </div>
    <nav class="user-links">
      <router-link to="/user" class="user-link">사용자</router-link>
      <a href="#" @click.prevent="handleLogout">로그아웃</a>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToUpload = () => {
  router.push("/");
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentPipelineId");
  localStorage.removeItem("currentProjectId");
  localStorage.removeItem("currentReportId");
  router.push("/login");
};
</script>
