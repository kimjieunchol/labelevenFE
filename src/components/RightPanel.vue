<template>
  <section class="panel panel-wide">
    <h2 class="panel-title">진단 결과</h2>
    <div class="summary-row">
      <div v-for="card in summaryCards" :key="card.label" class="summary-card" :class="card.tone">
        <div class="summary-label">{{ card.label }}</div>
        <div class="summary-value">{{ card.value }}</div>
        <div class="summary-detail">{{ card.detail }}</div>
      </div>
    </div>
    <div class="findings">
      <div
        v-for="finding in findings"
        :key="finding.title"
        class="finding-card"
        :class="isActive(finding) && 'card-active'"
        @mouseenter="onEnter(finding)"
        @mouseleave="onLeave"
      >
        <div class="finding-head">
          <div>
            <div class="finding-title">{{ finding.title }}</div>
          </div>
          <div class="finding-tags">
            <span class="status-pill">{{ finding.status }}</span>
            <span class="chip" :class="finding.categoryTone">{{ finding.category }}</span>
          </div>
        </div>
        <div class="finding-body">
          <div class="law-line" v-for="line in finding.laws" :key="line">{{ line }}</div>
          <a class="text-link" href="#">원문 보기</a>
          <div class="action-box">
            <div class="action-line">조치: Add a 'Contains: XXX' line and bold allergens.</div>
            <div class="action-line">컨버전율: 76%</div>
            <div class="action-line">근거: Allergens: Produced in a facility handling nuts (peanut, soy)</div>
          </div>
        </div>
        <div class="finding-footer">
          <button class="ghost-btn">자동 수정 적용</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  hoveredLink: Object,
});

const emit = defineEmits(['hover-link', 'leave-link']);

const onEnter = (finding) => emit('hover-link', { linkId: finding.linkId });
const onLeave = () => emit('leave-link');
const isActive = (finding) => props.hoveredLink && props.hoveredLink.linkId === finding.linkId;

const summaryCards = [
  { label: 'WARN', value: 'Overall', detail: '4 rules', tone: 'tone-warn' },
  { label: 'PASS', value: '1', detail: 'items', tone: 'tone-pass' },
  { label: 'REVIEW', value: '3', detail: 'items', tone: 'tone-review' },
  { label: 'MISSING', value: '0', detail: 'items', tone: 'tone-missing' },
];

const findings = [
  {
    title: 'Allergen prominence (Contains line)',
    status: 'WARN',
    category: '알레르겐',
    categoryTone: 'chip-warn',
    linkId: 'allergens',
    laws: ["21 CFR 101.4(b)(2)", "Add 'Contains' lead-in for allergens."],
  },
  {
    title: 'Allergen prominence (Contains line)',
    status: 'WARN',
    category: '영양 · 단위',
    categoryTone: 'chip-nutrition',
    linkId: 'ingredients',
    laws: ["21 CFR 101.4(b)(2)", "Add 'Contains' lead-in for allergens."],
  },
];
</script>
