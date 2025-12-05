<template>
  <div class="upload-wrap">
    <div class="upload-card">
      <h2 class="upload-title">문서 업로드</h2>
      <div class="upload-form">
        <div class="form-row">
          <div class="form-label">제목</div>
          <input
            v-model="title"
            class="form-input"
            type="text"
            placeholder="업로드할 문서 제목을 입력하세요"
          />
        </div>
        <div class="form-row">
          <div class="form-label">수출국</div>
          <div class="select-wrap">
            <select v-model="country" class="form-select">
              <option disabled value="">나라를 선택하세요</option>
              <option value="US">미국</option>
              <option value="EU">유럽</option>
              <option value="JP">일본</option>
              <option value="AU">호주</option>
            </select>
          </div>
        </div>
        <div class="form-row form-row-upload">
          <div class="form-label">파일 첨부</div>
          <div class="upload-area">
            <div class="upload-source-row">
              <label class="upload-source" for="fileInput">내 PC</label>
              <input
                id="fileInput"
                type="file"
                class="hidden-file"
                @change="onFileSelect"
              />
            </div>
            <div
              class="upload-drop"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="{
                'drop-active': dragOver,
                'drop-has-files': files.length,
              }"
            >
              <template v-if="files.length">
                <div class="file-list file-list-inline">
                  <table>
                    <thead>
                      <tr>
                        <th>파일명</th>
                        <th>용량</th>
                        <th>업로드 상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="fileItem in files" :key="fileItem.name">
                        <td class="file-name">
                          <span
                            class="file-remove"
                            @click="removeFile(fileItem.name)"
                            >✕</span
                          >
                          <span>{{ fileItem.name }}</span>
                        </td>
                        <td>{{ fileItem.size }}</td>
                        <td>{{ uploading ? "업로드 중..." : "대기" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
              <template v-else>
                <div class="drop-inner">
                  <div class="drop-icon">+</div>
                  <div class="drop-text">파일을 마우스로 끌어 오세요</div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button
            class="primary-btn"
            @click="handleUpload"
            :disabled="uploading || !canUpload"
          >
            {{ uploading ? "업로드 중..." : "결과 확인하기" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { projectAPI, reportAPI } from "../api/api.js";

const router = useRouter();
const dragOver = ref(false);
const files = ref([]);
const title = ref("");
const country = ref("");
const uploading = ref(false);

const canUpload = computed(() => {
  return title.value.trim() && country.value && files.value.length > 0;
});

const formatSize = (bytes) => {
  if (bytes === 0 || isNaN(bytes)) return "0KB";
  const kb = bytes / 1024;
  return `${kb.toFixed(2)}KB`;
};

const addFiles = (fileList) => {
  const incoming = Array.from(fileList).map((f) => ({
    name: f.name,
    size: formatSize(f.size),
    file: f,
  }));
  files.value = [...files.value, ...incoming];
};

const onFileSelect = (e) => {
  addFiles(e.target.files || []);
  e.target.value = "";
};

const onDrop = (e) => {
  dragOver.value = false;
  addFiles(e.dataTransfer.files || []);
};

const onDragOver = () => {
  dragOver.value = true;
};

const onDragLeave = () => {
  dragOver.value = false;
};

const removeFile = (name) => {
  files.value = files.value.filter((f) => f.name !== name);
};

const handleUpload = async () => {
  if (!canUpload.value) {
    alert("제목, 수출국, 파일을 모두 입력해주세요.");
    return;
  }

  try {
    uploading.value = true;

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("country", country.value);

    // 첫 번째 파일만 업로드
    if (files.value[0]?.file) {
      formData.append("file", files.value[0].file);
    }

    console.log("업로드 시작:", { title: title.value, country: country.value });

    // 1. 프로젝트 생성
    const projectResponse = await projectAPI.uploadFile(formData);
    console.log("프로젝트 생성 성공:", projectResponse);

    const projectId = projectResponse.data?.id;

    if (!projectId) {
      throw new Error("프로젝트 ID를 받지 못했습니다.");
    }

    // 2. 보고서 생성 요청
    const reportResponse = await reportAPI.createReport({
      projectId: projectId,
      reportType: "MERGE",
    });

    console.log("보고서 생성 성공:", reportResponse);

    alert("파일 업로드 및 보고서 생성 성공!");

    // 3. 보고서 확인 페이지로 이동
    router.push({
      path: "/review",
      query: { reportId: reportResponse.data?.id },
    });
  } catch (error) {
    console.error("업로드 에러:", error);
    alert("업로드 실패: " + (error.response?.data?.message || error.message));
  } finally {
    uploading.value = false;
  }
};
</script>
