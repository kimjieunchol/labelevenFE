<template>
  <div class="user-layout">
    <aside class="user-sidebar">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['user-tab', activeTab === tab.key && 'user-tab-active']"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </div>
    </aside>
    <section class="user-content">
      <div class="user-filters">
        <label
          >제목
          <input
            v-model="cardTitleInput"
            type="text"
            placeholder="제목을 입력하세요"
        /></label>
        <label
          >수출국
          <select v-model="countryInput">
            <option value="">선택</option>
            <option value="US">미국</option>
            <option value="EU">유럽</option>
            <option value="JP">일본</option>
            <option value="AU">호주</option>
          </select>
        </label>
        <label>생성일자 <input v-model="cardDateInput" type="date" /></label>
        <button class="primary-btn filter-btn" @click="applyCardFilters">
          검색
        </button>
      </div>

      <div v-if="loading" class="loading">데이터 로딩 중...</div>

      <div v-else class="user-cards">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="user-card"
          @click="viewReport(card.id)"
          style="cursor: pointer"
        >
          <div class="card-title">{{ card.title }}</div>
          <div class="card-body">{{ card.body }}</div>
          <div class="card-date">{{ formatDate(card.createdAt) }}</div>
          <div class="card-actions">
            <button class="ghost-btn" @click.stop="downloadReport(card.id)">
              다운로드
            </button>
            <button class="decline-btn" @click.stop="deleteReport(card.id)">
              삭제
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { reportAPI } from "../api/api.js";

const router = useRouter();
const loading = ref(false);
const reports = ref([]);

const tabs = [
  { key: "upload-list", label: "업로드한 데이터", route: "/user" },
  { key: "merge-report", label: "정합 보고서", route: "/user/merge" },
  { key: "final-report", label: "최종 보고서", route: "/user/final" },
  { key: "raw-data", label: "원본 데이터", route: "/user/raw" },
];

const activeTab = ref("merge-report");

const cardTitleInput = ref("");
const cardDateInput = ref("");
const countryInput = ref("");
const appliedCardTitle = ref("");
const appliedCardDate = ref("");
const appliedCountry = ref("");

onMounted(async () => {
  await loadReports();
});

const loadReports = async () => {
  try {
    loading.value = true;
    const response = await reportAPI.getReports("MERGE");
    reports.value = response.data?.reports || [];
  } catch (error) {
    console.error("보고서 로딩 실패:", error);
    alert("데이터를 불러오는데 실패했습니다.");
  } finally {
    loading.value = false;
  }
};

const switchTab = (key) => {
  const tab = tabs.find((t) => t.key === key);
  if (tab?.route) {
    router.push(tab.route);
  }
  resetFilters();
};

const resetFilters = () => {
  cardTitleInput.value = "";
  cardDateInput.value = "";
  countryInput.value = "";
  appliedCardTitle.value = "";
  appliedCardDate.value = "";
  appliedCountry.value = "";
};

const applyCardFilters = () => {
  appliedCardTitle.value = cardTitleInput.value.trim();
  appliedCardDate.value = cardDateInput.value;
  appliedCountry.value = countryInput.value;
};

const filteredCards = computed(() =>
  reports.value.filter((card) => {
    const matchTitle = appliedCardTitle.value
      ? card.title.toLowerCase().includes(appliedCardTitle.value.toLowerCase())
      : true;
    const matchDate = appliedCardDate.value
      ? card.createdAt?.startsWith(appliedCardDate.value)
      : true;
    const matchCountry = appliedCountry.value
      ? card.country === appliedCountry.value
      : true;
    return matchTitle && matchDate && matchCountry;
  })
);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
};

const viewReport = (id) => {
  router.push({ path: "/review", query: { reportId: id } });
};

const downloadReport = async (id) => {
  try {
    const response = await reportAPI.downloadReport(id, "PDF");
    window.open(response.data, "_blank");
  } catch (error) {
    console.error("다운로드 실패:", error);
    alert("다운로드에 실패했습니다.");
  }
};

const deleteReport = async (id) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await reportAPI.deleteReport(id);
    alert("삭제되었습니다.");
    await loadReports();
  } catch (error) {
    console.error("삭제 실패:", error);
    alert("삭제에 실패했습니다.");
  }
};
</script>
