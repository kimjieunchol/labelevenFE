<template>
  <div class="results-page">
    <div class="tag-actions-row">
      <div class="tag-bar">
        <div
          v-for="tag in tags"
          :key="tag.label"
          :class="['tag-chip', tag.tone, selectedTag === tag.label && 'tag-chip-active']"
          @mouseenter="hoverTag = tag.label"
          @mouseleave="hoverTag = null"
          @click="toggleTag(tag.label)"
        >
          {{ tag.label }}
        </div>
      </div>
      <button class="primary-btn" @click="openChecklist">보고서 확인하기</button>
    </div>
    <main class="layout">
      <LeftPanel
        :hovered-link="hoveredLink"
        :selected-tag="selectedTag"
        :hover-tag="hoverTag"
        @hover-link="setHoverLink"
        @leave-link="clearHoverLink"
      />
      <CenterPanel
        :hovered-link="hoveredLink"
        :selected-tag="selectedTag"
        :hover-tag="hoverTag"
        @hover-link="setHoverLink"
        @leave-link="clearHoverLink"
      />
      <RightPanel
        :hovered-link="hoveredLink"
        :selected-tag="selectedTag"
        :hover-tag="hoverTag"
        @hover-link="setHoverLink"
        @leave-link="clearHoverLink"
      />
    </main>
    <transition name="slide-in">
      <div v-if="showChecklist" class="checklist-drawer">
        <div class="checklist-header">
          <div class="checklist-title">보고서 생성 전 확인</div>
          <button class="ghost-btn" @click="closeChecklist">닫기</button>
        </div>
        <div class="checklist-items">
          <label v-for="item in checklist" :key="item.id" class="check-item">
            <input type="checkbox" v-model="item.checked" />
            <span>{{ item.label }}</span>
          </label>
        </div>
        <div class="checklist-actions">
          <button class="primary-btn" @click="createReport">보고서 생성하기</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LeftPanel from '../components/LeftPanel.vue';
import CenterPanel from '../components/CenterPanel.vue';
import RightPanel from '../components/RightPanel.vue';

const router = useRouter();
const hoveredLink = ref(null);
const selectedTag = ref(null);
const hoverTag = ref(null);
const showChecklist = ref(false);
const checklist = ref([
  { id: 1, label: '원본/번역 데이터 검토 완료', checked: false },
  { id: 2, label: '진단 결과 확인', checked: false },
  { id: 3, label: '자동 수정 적용 여부 확인', checked: false },
]);

const tags = [
  { label: '일반 정보', tone: 'chip-neutral' },
  { label: '영양 · 단위', tone: 'chip-nutrition' },
  { label: '알레르겐', tone: 'chip-warn' },
  { label: '첨가물 · 코드', tone: 'chip-amber' },
  { label: '표기 · 기한', tone: 'chip-shelflife' },
  { label: '원산지 · 공장', tone: 'chip-origin' },
];

const toggleTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
};

const setHoverLink = (payload) => {
  hoveredLink.value = payload;
};

const clearHoverLink = () => {
  hoveredLink.value = null;
};

const openChecklist = () => {
  showChecklist.value = true;
};

const closeChecklist = () => {
  showChecklist.value = false;
};

const createReport = () => {
  // 필요 시 체크 상태 검증 추가 가능
  router.push('/report');
};
</script>
