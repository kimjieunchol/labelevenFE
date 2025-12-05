<template>
  <section class="panel">
    <h2 class="panel-title">번역 데이터</h2>
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
  { label: 'Product Name:', value: 'Ocean Sparkling Lemon 350ml', tag: '일반 정보', tone: 'chip-neutral', linkId: 'product' },
  {
    label: 'Ingredients:',
    value: 'Carbonated water, Natural lemon flavor,Sugars 12g, Sodium 25mg',
    tag: '영양 · 단위',
    tone: 'chip-nutrition',
    linkId: 'ingredients',
  },
  { label: 'Allergens:', value: 'Produced in a facility handling nuts (peanut,soy)', tag: '알레르겐', tone: 'chip-warn', linkId: 'allergens' },
  { label: 'Additives:', value: '보존료 (E211), 천연 색소', tag: '첨가물 · 코드', tone: 'chip-amber', linkId: 'additives' },
  { label: 'Shelf Life:', value: '12 months from manufacturing date', tag: '표기 · 기한', tone: 'chip-shelflife', linkId: 'shelf-life' },
  { label: 'Manufactured by:', value: '부산 스마트팩토리 (Republic of Korea)', tag: '원산지 · 공장', tone: 'chip-origin', linkId: 'manufacturer' },
  { label: 'Storage:', value: '직사광선을 피해 서늘한 곳에 Storage', tag: '표기 · 기한', tone: 'chip-shelflife', linkId: 'storage' },
];

const filteredItems = computed(() =>
  props.selectedTag ? items.filter((item) => item.tag === props.selectedTag) : items,
);
</script>
