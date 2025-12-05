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
          <div class="card-body">
            {{ card.body || "최종 보고서 내용 미리보기" }}
          </div>
          <div class="card-date">{{ formatDate(card.createdAt) }}</div>
          <div class="card-actions">
            <button class="ghost-btn" @click.stop="downloadReport(card.id)">
              PDF 다운로드
            </button>
            <button class="primary-btn" @click.stop="viewReport(card.id)">
              상세보기
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

const activeTab = ref("final-report");

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
    const response = await reportAPI.getReports("FINAL");
    reports.value = response.data?.reports || [];
  } catch (error) {
    console.error("최종 보고서 로딩 실패:", error);
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
  router.push({ path: "/report", query: { reportId: id } });
};

const downloadReport = async (id) => {
  try {
    const response = await reportAPI.downloadReport(id, "PDF");
    if (response.data) {
      window.open(response.data, "_blank");
    } else {
      alert("다운로드 URL을 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("다운로드 실패:", error);
    alert("다운로드에 실패했습니다.");
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
}
</style>
