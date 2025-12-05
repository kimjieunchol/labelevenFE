<template>
  <div class="report-view">
    <iframe class="pdf-frame-full" :src="pdfUrl" title="보고서 PDF"></iframe>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// TODO: 백엔드에서 전달되는 PDF 경로로 교체하세요.
// 정적 테스트: labelableFE/public/21_CFR_101_7.pdf 로 파일을 두고 아래 경로 사용
const pdfUrl = ref('/21_CFR_101_7.pdf');
</script>
