<template>
  <div>
    <div class="action-row">
      <router-link to="/report">
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { pipelineAPI } from "../api/api.js";
import LeftPanel from "../components/LeftPanel.vue";
import CenterPanel from "../components/CenterPanel.vue";
import RightPanel from "../components/RightPanel.vue";

const route = useRoute();
const hoveredLink = ref(null);
const pipelineId = ref(null);
let statusInterval = null;

onMounted(() => {
  pipelineId.value = route.query.pipelineId;

  if (pipelineId.value) {
    checkPipelineStatus();
    // 5초마다 파이프라인 상태 체크
    statusInterval = setInterval(checkPipelineStatus, 5000);
  }
});

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval);
  }
});

const checkPipelineStatus = async () => {
  try {
    const response = await pipelineAPI.getPipelineStatus(pipelineId.value);
    console.log("파이프라인 상태:", response.data);

    // 완료되거나 실패하면 폴링 중단
    if (
      response.data.status === "COMPLETED" ||
      response.data.status === "FAILED"
    ) {
      clearInterval(statusInterval);
    }
  } catch (error) {
    console.error("파이프라인 상태 체크 실패:", error);
  }
};

const setHoverLink = (payload) => {
  hoveredLink.value = payload;
};

const clearHoverLink = () => {
  hoveredLink.value = null;
};
</script>
