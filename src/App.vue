<template>
  <div class="page">
    <TopBar v-if="!hideTopBar" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from './components/TopBar.vue';

const route = useRoute();
const hideTopBar = computed(() => route.name === 'login' || route.name === 'signup');
</script>
