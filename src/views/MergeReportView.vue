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
            <option>유럽</option>
            <option>미국</option>
            <option>일본</option>
            <option>호주</option>
          </select>
        </label>
        <label>생성일자 <input v-model="cardDateInput" type="date" /></label>
        <button class="primary-btn filter-btn" @click="applyCardFilters">
          검색
        </button>
      </div>
      <div v-if="loading" style="text-align: center; padding: 40px">
        <p>데이터를 불러오는 중...</p>
      </div>
      <div v-else class="user-cards">
        <div v-for="card in filteredCards" :key="card.id" class="user-card">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-body">{{ card.body }}</div>
          <div class="card-date">{{ card.date }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { reportAPI } from "../services/api";

const router = useRouter();
const loading = ref(true);
const cards = ref([]);

const tabs = [
  { key: "upload-list", label: "업로드한 데이터", route: "/user" },
  { key: "merge-report", label: "정합 보고서", route: "/user/merge" },
  { key: "final-report", label: "최종 보고서", route: "/user/final" },
];

const activeTab = ref("merge-report");

const switchTab = (key) => {
  const tab = tabs.find((t) => t.key === key);
  if (tab?.route) {
    router.push(tab.route);
  }
  resetFilters();
};

const cardTitleInput = ref("");
const cardDateInput = ref("");
const countryInput = ref("");
const appliedCardTitle = ref("");
const appliedCardDate = ref("");
const appliedCountry = ref("");

// API에서 정합 보고서 목록 가져오기
onMounted(async () => {
  try {
    const response = await reportAPI.getReports("MERGE");
    if (response.success && response.data.reports) {
      cards.value = response.data.reports.map((item) => ({
        id: item.id,
        title: item.projectTitle || "정합 보고서",
        body: item.summary?.substring(0, 100) || "정합 보고서 내용",
        date: new Date(item.createdAt)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "."),
        country: item.country || "",
      }));
    }
  } catch (error) {
    console.error("정합 보고서 목록 로딩 실패:", error);
  } finally {
    loading.value = false;
  }
});

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
  appliedCardDate.value = cardDateInput.value
    ? cardDateInput.value.replace(/-/g, ".")
    : "";
  appliedCountry.value = countryInput.value;
};

const filteredCards = computed(() =>
  cards.value.filter((card) => {
    const matchTitle = appliedCardTitle.value
      ? card.title.toLowerCase().includes(appliedCardTitle.value.toLowerCase())
      : true;
    const matchDate = appliedCardDate.value
      ? card.date === appliedCardDate.value
      : true;
    const matchCountry = appliedCountry.value
      ? card.country === appliedCountry.value
      : true;
    return matchTitle && matchDate && matchCountry;
  })
);
</script>
