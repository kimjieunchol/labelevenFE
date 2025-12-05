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
        <label>제목 <input v-model="cardTitleInput" type="text" placeholder="제목을 입력하세요" /></label>
        <label>수출국
          <select v-model="countryInput">
            <option value="">선택</option>
            <option>유럽</option>
            <option>미국</option>
            <option>일본</option>
            <option>호주</option>
          </select>
        </label>
        <label>생성일자 <input v-model="cardDateInput" type="date" /></label>
        <button class="primary-btn filter-btn" @click="applyCardFilters">검색</button>
      </div>
      <div class="user-cards">
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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const tabs = [
  { key: 'upload-list', label: '업로드한 데이터', route: '/user' },
  { key: 'merge-report', label: '정합 보고서', route: '/user/merge' },
  { key: 'final-report', label: '최종 보고서', route: '/user/final' },
];

const activeTab = ref('merge-report');

const switchTab = (key) => {
  const tab = tabs.find((t) => t.key === key);
  if (tab?.route) {
    router.push(tab.route);
  }
  resetFilters();
};

const cards = Array.from({ length: 18 }).map((_, idx) => ({
  id: idx,
  title: idx % 2 === 0 ? '정합 보고서 샘플' : '정합 보고서 유럽 진단',
  body:
    '정합 보고서 샘플 텍스트입니다. 실제 데이터로 교체될 예정입니다. 정합 보고서 샘플 텍스트입니다.',
  date: '2025-12-04',
  country: idx % 3 === 0 ? '유럽' : idx % 3 === 1 ? '미국' : '일본',
}));

const cardTitleInput = ref('');
const cardDateInput = ref('');
const countryInput = ref('');
const appliedCardTitle = ref('');
const appliedCardDate = ref('');
const appliedCountry = ref('');

const resetFilters = () => {
  cardTitleInput.value = '';
  cardDateInput.value = '';
  countryInput.value = '';
  appliedCardTitle.value = '';
  appliedCardDate.value = '';
  appliedCountry.value = '';
};

const applyCardFilters = () => {
  appliedCardTitle.value = cardTitleInput.value.trim();
  appliedCardDate.value = cardDateInput.value;
  appliedCountry.value = countryInput.value;
};

const filteredCards = computed(() =>
  cards.filter((card) => {
    const matchTitle = appliedCardTitle.value
      ? card.title.toLowerCase().includes(appliedCardTitle.value.toLowerCase())
      : true;
    const matchDate = appliedCardDate.value ? card.date === appliedCardDate.value : true;
    const matchCountry = appliedCountry.value ? card.country === appliedCountry.value : true;
    return matchTitle && matchDate && matchCountry;
  }),
);
</script>
