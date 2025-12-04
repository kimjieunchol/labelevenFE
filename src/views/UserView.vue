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
      <template v-if="activeTab === 'upload-list'">
        <div class="user-filters">
          <label>제목 <input v-model="titleInput" type="text" placeholder="제목을 입력하세요" /></label>
          <label>파일명 <input v-model="fileInput" type="text" placeholder="파일명을 입력하세요" /></label>
          <label>생성일자 <input v-model="dateInput" type="date" /></label>
          <button class="primary-btn filter-btn" @click="applyTableFilters">검색</button>
        </div>
        <div class="user-table">
          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>파일명</th>
                <th>용량</th>
                <th>생성 날짜</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filteredRows" :key="row.id">
                <td>{{ row.title }}</td>
                <td class="file-name-cell">{{ row.filename }}</td>
                <td>{{ row.size }}</td>
                <td>{{ row.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
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
      </template>
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
  { key: 'raw-data', label: '원본 데이터', route: '/user/raw' },
];

const activeTab = ref('upload-list');

const resetFilters = () => {
  titleInput.value = '';
  fileInput.value = '';
  dateInput.value = '';
  appliedTitle.value = '';
  appliedFile.value = '';
  appliedDate.value = '';

  cardTitleInput.value = '';
  cardDateInput.value = '';
  countryInput.value = '';
  appliedCardTitle.value = '';
  appliedCardDate.value = '';
  appliedCountry.value = '';
};

const switchTab = (key) => {
  const tab = tabs.find((t) => t.key === key);
  if (tab?.route) {
    router.push(tab.route);
  }
  activeTab.value = key;
  resetFilters();
};

const tableRows = Array.from({ length: 18 }).map((_, idx) => ({
  id: idx,
  title: idx % 2 === 0 ? '밀키스 유럽 진단' : '핫식스 유럽 진단',
  filename: idx % 3 === 0 ? '21 CFR 101.7.pdf' : 'logo.png',
  size: idx % 3 === 0 ? '60.98KB' : '227.68KB',
  date: '2025-12-04',
}));

const cards = Array.from({ length: 18 }).map((_, idx) => ({
  id: idx,
  title: idx % 2 === 0 ? '밀키스 유럽 진단' : '핫식스 유럽 진단',
  body:
    '보고서 샘플 문장 붙을 자리입니다보고서 샘플 문장 붙을 자리입니다보고서 샘플 문장 붙을 자리입니다보고서 샘플 문장 붙을 자리입니다',
  date: '2025-12-04',
  country: idx % 3 === 0 ? '유럽' : idx % 3 === 1 ? '미국' : '일본',
}));

// 테이블 필터 상태
const titleInput = ref('');
const fileInput = ref('');
const dateInput = ref('');
const appliedTitle = ref('');
const appliedFile = ref('');
const appliedDate = ref('');

const applyTableFilters = () => {
  appliedTitle.value = titleInput.value.trim();
  appliedFile.value = fileInput.value.trim();
  appliedDate.value = dateInput.value;
};

const filteredRows = computed(() =>
  tableRows.filter((row) => {
    const matchTitle = appliedTitle.value
      ? row.title.toLowerCase().includes(appliedTitle.value.toLowerCase())
      : true;
    const matchFile = appliedFile.value
      ? row.filename.toLowerCase().includes(appliedFile.value.toLowerCase())
      : true;
    const matchDate = appliedDate.value ? row.date === appliedDate.value : true;
    return matchTitle && matchFile && matchDate;
  }),
);

// 카드 필터 상태
const cardTitleInput = ref('');
const cardDateInput = ref('');
const countryInput = ref('');
const appliedCardTitle = ref('');
const appliedCardDate = ref('');
const appliedCountry = ref('');

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
