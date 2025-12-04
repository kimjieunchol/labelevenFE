<template>
  <div>
    <div class="action-row">
      <router-link to="/results">
        <button class="primary-btn">보고서 확인하기</button>
      </router-link>
    </div>
    <main class="layout">
      <LeftPanel
        :hovered-link="hoveredLink"
        @hover-link="setHoverLink"
        @leave-link="clearHoverLink"
      />
      <CenterPanel
        :hovered-link="hoveredLink"
        @hover-link="setHoverLink"
        @leave-link="clearHoverLink"
      />
      <RightPanel
        :hovered-link="hoveredLink"
        @hover-link="setHoverLink"
        @leave-link="clearHoverLink"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LeftPanel from '../components/LeftPanel.vue';
import CenterPanel from '../components/CenterPanel.vue';
import RightPanel from '../components/RightPanel.vue';

const hoveredLink = ref(null);

const setHoverLink = (payload) => {
  hoveredLink.value = payload;
};

const clearHoverLink = () => {
  hoveredLink.value = null;
};
</script>
