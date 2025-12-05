<template>
  <div class="review-wrap">
    <div v-if="loading" class="loading">보고서 로딩 중...</div>

    <div v-else class="review-card">
      <h2 class="review-title">병합 보고서</h2>
      <div class="review-body">
        <p v-for="(line, idx) in reportLines" :key="idx">{{ line }}</p>
      </div>
      <div class="review-actions">
        <button
          class="decline-btn"
          @click="handleDecline"
          :disabled="processing"
        >
          {{ processing ? "처리 중..." : "DECLINE" }}
        </button>
        <button class="primary-btn" @click="handleAllow" :disabled="processing">
          {{ processing ? "처리 중..." : "ALLOW" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { reportAPI, pipelineAPI } from "../api/api.js";

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const processing = ref(false);
const reportData = ref(null);
const reportLines = ref([]);

onMounted(async () => {
  const reportId = route.query.reportId;
  if (reportId) {
    await loadReport(reportId);
  } else {
    alert("보고서 ID가 없습니다.");
    router.push("/user/merge");
  }
});

const loadReport = async (reportId) => {
  try {
    loading.value = true;
    const response = await reportAPI.getReport(reportId);
    reportData.value = response.data;

    // 보고서 내용을 줄 단위로 분리
    if (reportData.value.content) {
      reportLines.value = reportData.value.content.split("\n");
    } else {
      reportLines.value = [
        "제품명: 해양 스파클링 레몬 350ml",
        "성분: 탄산수, 천연 레몬향, 당류 12g, 나트륨 25mg",
        "알레르겐: 견과류 취급 공장에서 제조 (땅콩, 대두)",
        "첨가물: 보존료 (E211), 천연 색소",
        "유통기한: 제조일로부터 12개월",
        "제조원: 부산 스마트팩토리 (대한민국)",
        "보관: 직사광선을 피해 서늘한 곳에 보관",
      ];
    }
  } catch (error) {
    console.error("보고서 로딩 실패:", error);
    alert("보고서를 불러오는데 실패했습니다.");
    router.push("/user/merge");
  } finally {
    loading.value = false;
  }
};

const handleDecline = async () => {
  if (!confirm("보고서를 거절하시겠습니까? 다시 생성으로 돌아갑니다.")) return;

  try {
    processing.value = true;
    const reportId = route.query.reportId;

    await reportAPI.approveReport({
      reportId: parseInt(reportId),
      approved: false,
      feedback: "사용자가 거절함",
    });

    alert("보고서가 거절되었습니다.");
    router.push("/upload");
  } catch (error) {
    console.error("거절 처리 실패:", error);
    alert("처리에 실패했습니다.");
  } finally {
    processing.value = false;
  }
};

const handleAllow = async () => {
  if (!confirm("보고서를 승인하고 파이프라인을 실행하시겠습니까?")) return;

  try {
    processing.value = true;
    const reportId = route.query.reportId;

    // 1. 보고서 승인
    const approveResponse = await reportAPI.approveReport({
      reportId: parseInt(reportId),
      approved: true,
    });

    console.log("보고서 승인 완료:", approveResponse);

    // 2. 파이프라인 실행
    const pipelineResponse = await pipelineAPI.executePipeline({
      reportId: parseInt(reportId),
    });

    console.log("파이프라인 실행 시작:", pipelineResponse);

    alert("보고서가 승인되고 파이프라인이 시작되었습니다.");

    // 3. 결과 페이지로 이동 (파이프라인 ID 포함)
    router.push({
      path: "/results",
      query: {
        reportId: reportId,
        pipelineId: pipelineResponse.data?.id,
      },
    });
  } catch (error) {
    console.error("승인 처리 실패:", error);
    console.error("에러 상세:", error.response?.data);
    alert(
      "처리에 실패했습니다: " + (error.response?.data?.message || error.message)
    );
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
</style>
