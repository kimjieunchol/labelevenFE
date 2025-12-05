<template>
  <section class="panel">
    <h2 class="panel-title">원본 데이터</h2>
    <div class="info-list">
      <div
        v-for="item in filteredItems"
        :key="item.label"
        class="info-card"
        :class="isActive(item) && 'card-active'"
        @mouseenter="onEnter(item)"
        @mouseleave="onLeave"
      >
        <div class="info-text">
          <span class="info-label">{{ item.label }}</span>
          <span class="info-value">{{ item.value }}</span>
        </div>
        <span class="chip" :class="item.tone">{{ item.tag }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  hoveredLink: Object,
  selectedTag: String,
  hoverTag: String,
});

const emit = defineEmits(['hover-link', 'leave-link']);

const onEnter = (item) => emit('hover-link', { linkId: item.linkId });
const onLeave = () => emit('leave-link');

const isActive = (item) =>
  (props.hoveredLink && props.hoveredLink.linkId === item.linkId) ||
  (props.hoverTag && props.hoverTag === item.tag);

const items = [
  { label: '제품명:', value: '해양 스파클링 레몬 350ml', tag: '일반 정보', tone: 'chip-neutral', linkId: 'product' },
  { label: '성분:', value: '탄산수, 천연 레몬향, 당류 12g, 나트륨 25mg', tag: '영양 · 단위', tone: 'chip-nutrition', linkId: 'ingredients' },
  { label: '알레르겐:', value: '견과류 취급 공장에서 제조 (땅콩, 대두)', tag: '알레르겐', tone: 'chip-warn', linkId: 'allergens' },
  { label: '첨가물:', value: '보존료 (E211), 천연 색소', tag: '첨가물 · 코드', tone: 'chip-amber', linkId: 'additives' },
  { label: '유통기한:', value: '제조입력부터 12개월', tag: '표기 · 기한', tone: 'chip-shelflife', linkId: 'shelf-life' },
  { label: '제조원:', value: '부산 스마트팩토리 (대한민국)', tag: '원산지 · 공장', tone: 'chip-origin', linkId: 'manufacturer' },
  { label: '보관:', value: '직사광선을 피해 서늘한 곳에 보관', tag: '표기 · 기한', tone: 'chip-shelflife', linkId: 'storage' },
];

const filteredItems = computed(() =>
  props.selectedTag ? items.filter((item) => item.tag === props.selectedTag) : items,
);
</script>
