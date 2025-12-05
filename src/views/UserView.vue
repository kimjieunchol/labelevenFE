<template>
  <div class="report-page">
    <aside class="report-side">
      <div class="report-side-title">보고서</div>
    </aside>
    <section class="report-main">
      <div class="report-filters">
        <div class="report-filter">
          <label for="titleInput">제목</label>
          <input
            id="titleInput"
            v-model="titleInput"
            type="text"
            placeholder="제목을 입력하세요"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="report-filter">
          <label for="dateInput">생성일자</label>
          <input
            id="dateInput"
            v-model="dateInput"
            type="date"
            @keyup.enter="applyFilters"
          />
        </div>
        <div class="filter-actions">
          <button class="primary-btn report-search-btn" @click="applyFilters">검색</button>
          <button class="ghost-btn report-reset-btn" @click="resetFilters">초기화</button>
        </div>
      </div>

      <div class="report-table-wrapper">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 40px;">X</th>
              <th>제목</th>
              <th>정합된 보고서</th>
              <th style="width: 90px;">용량</th>
              <th>최종 보고서</th>
              <th style="width: 90px;">용량</th>
              <th style="width: 110px;">생성 일자</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="row.id">
              <td class="cell-center delete-cell" @click="removeRow(row.id)">X</td>
              <td>{{ row.title }}</td>
              <td>{{ row.mergeReport }}</td>
              <td class="cell-center">{{ row.mergeSize }}</td>
              <td>{{ row.finalReport }}</td>
              <td class="cell-center">{{ row.finalSize }}</td>
              <td class="cell-center">{{ row.date }}</td>
            </tr>
            <tr v-if="!filteredRows.length">
              <td colspan="7" class="cell-center empty-cell">검색 결과가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const rows = ref([
  {
    id: 1,
    title: '밀키스 유럽 규격 변환',
    mergeReport: '밀키스 유럽 규격 변환_정합본',
    mergeSize: '60.98KB',
    finalReport: '밀키스 유럽 규격 변환_최종본',
    finalSize: '160.98KB',
    date: '2025.12.01',
  },
  {
    id: 2,
    title: '밀키스 미국 규격 변환',
    mergeReport: '밀키스 미국 규격 변환_정합본',
    mergeSize: '60.98KB',
    finalReport: '밀키스 미국 규격 변환_최종본',
    finalSize: '160.98KB',
    date: '2025.12.01',
  },
  {
    id: 3,
    title: '밀키스 일본 규격 변환',
    mergeReport: '밀키스 일본 규격 변환_정합본',
    mergeSize: '60.98KB',
    finalReport: '밀키스 일본 규격 변환_최종본',
    finalSize: '160.98KB',
    date: '2025.12.01',
  },
  {
    id: 4,
    title: '밀키스 인도 규격 변환',
    mergeReport: '밀키스 인도 규격 변환_정합본',
    mergeSize: '60.98KB',
    finalReport: '밀키스 인도 규격 변환_최종본',
    finalSize: '160.98KB',
    date: '2025.12.01',
  },
  // 더미 데이터 추가
  ...Array.from({ length: 12 }).map((_, idx) => ({
    id: 5 + idx,
    title: idx % 2 === 0 ? '밀키스 유럽 규격 변환' : '밀키스 미국 규격 변환',
    mergeReport: idx % 2 === 0 ? '밀키스 유럽 규격 변환_정합본' : '밀키스 미국 규격 변환_정합본',
    mergeSize: '60.98KB',
    finalReport: idx % 2 === 0 ? '밀키스 유럽 규격 변환_최종본' : '밀키스 미국 규격 변환_최종본',
    finalSize: '160.98KB',
    date: '2025.12.01',
  })),
]);

const titleInput = ref('');
const dateInput = ref('2025-12-04');
const appliedTitle = ref('');
const appliedDate = ref('');

const applyFilters = () => {
  appliedTitle.value = titleInput.value.trim();
  appliedDate.value = dateInput.value ? dateInput.value.replace(/-/g, '.') : '';
};

const filteredRows = computed(() =>
  rows.value.filter((row) => {
    const matchTitle = appliedTitle.value
      ? row.title.toLowerCase().includes(appliedTitle.value.toLowerCase())
      : true;
    const matchDate = appliedDate.value ? row.date === appliedDate.value : true;
    return matchTitle && matchDate;
  }),
);

const resetFilters = () => {
  titleInput.value = '';
  dateInput.value = '';
  appliedTitle.value = '';
  appliedDate.value = '';
};

const removeRow = (id) => {
  rows.value = rows.value.filter((row) => row.id !== id);
};
</script>
