<template>
  <div class="report-wrap">
    <div class="report-actions">
      <button class="pdf-btn" @click="handleDownloadPDF">pdf 저장하기</button>
    </div>
    <div class="report-card" ref="reportContent">
      <h2 class="report-title">보고서</h2>
      <div class="report-body">
        <p>{{ reportText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { reportAPI } from "../api/api.js";

const route = useRoute();
const reportContent = ref(null);
const reportText = ref("");

onMounted(async () => {
  const reportId = route.query.reportId;

  if (reportId) {
    try {
      const response = await reportAPI.getReport(reportId);
      reportText.value = response.data?.content || "보고서 내용이 없습니다.";
    } catch (error) {
      console.error("보고서 로딩 실패:", error);
      reportText.value = "보고서를 불러오는데 실패했습니다.";
    }
  } else {
    reportText.value = "보고서 전체 원문이 여기에 표시됩니다.";
  }
});

const handleDownloadPDF = async () => {
  const reportId = route.query.reportId;

  if (reportId) {
    try {
      const response = await reportAPI.downloadReport(reportId, "PDF");
      if (response.data) {
        window.open(response.data, "_blank");
      } else {
        // 서버에서 URL을 반환하지 않으면 인쇄 기능 사용
        window.print();
      }
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("다운로드에 실패했습니다. 인쇄 기능을 사용하세요.");
      window.print();
    }
  } else {
    window.print();
  }
};
</script>

<style>
@media print {
  .report-actions {
    display: none;
  }
}
</style>
