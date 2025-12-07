<template>
  <div class="report-view">
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p>보고서를 생성 중입니다...</p>
    </div>
    <iframe
      v-else
      class="pdf-frame-full"
      :src="pdfUrl"
      title="보고서 PDF"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { reportAPI } from "../services/api";

const pdfUrl = ref("");
const loading = ref(true);

onMounted(async () => {
  const reportId = localStorage.getItem("currentReportId");

  if (!reportId) {
    // 임시 PDF 사용
    pdfUrl.value = "/21_CFR_101_7.pdf";
    loading.value = false;
    return;
  }

  try {
    // 보고서 상태 확인
    let attempts = 0;
    const maxAttempts = 30;

    const checkStatus = async () => {
      const response = await reportAPI.getReportStatus(reportId);

      if (response.success) {
        if (response.data.status === "COMPLETED") {
          // PDF 다운로드
          const blob = await reportAPI.downloadReport(reportId, "PDF");
          pdfUrl.value = URL.createObjectURL(blob);
          loading.value = false;
        } else if (response.data.status === "FAILED") {
          alert("보고서 생성에 실패했습니다.");
          pdfUrl.value = "/21_CFR_101_7.pdf";
          loading.value = false;
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 2000);
        } else {
          alert("보고서 생성 시간이 초과되었습니다.");
          pdfUrl.value = "/21_CFR_101_7.pdf";
          loading.value = false;
        }
      }
    };

    await checkStatus();
  } catch (error) {
    console.error("보고서 로딩 실패:", error);
    pdfUrl.value = "/21_CFR_101_7.pdf";
    loading.value = false;
  }
});
</script>
