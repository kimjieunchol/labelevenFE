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
            placeholder="생성할 보고서 이름을 입력하세요"
          />
        </div>
        <div class="form-row">
          <div class="form-label">수출국</div>
          <div class="select-wrap">
            <select v-model="country" class="form-select">
              <option disabled selected value="">나라를 선택하세요</option>
              <option>미국</option>
              <option>유럽</option>
              <option>일본</option>
              <option>호주</option>
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
                accept=".csv,.xlsx,.xls"
                @change="onFileSelect"
              />
            </div>
            <div
              class="upload-drop"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="[
                { 'drop-active': dragOver, 'drop-has-files': files.length },
              ]"
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
                      <tr v-for="file in files" :key="file.name">
                        <td class="file-name">
                          <span
                            class="file-remove"
                            @click="removeFile(file.name)"
                            >✕</span
                          >
                          <span>{{ file.name }}</span>
                        </td>
                        <td>{{ file.size }}</td>
                        <td>{{ file.status || "대기" }}</td>
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
        <div
          v-if="errorMessage"
          style="color: red; font-size: 14px; margin: 10px 0"
        >
          {{ errorMessage }}
        </div>
        <div class="form-actions">
          <button class="primary-btn" @click="handleUpload" :disabled="loading">
            {{ loading ? "업로드 중..." : "결과 확인하기" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { projectAPI, pipelineAPI } from "../services/api";

const router = useRouter();
const title = ref("");
const country = ref("");
const dragOver = ref(false);
const files = ref([]);
const loading = ref(false);
const errorMessage = ref("");

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
    status: "대기",
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
  errorMessage.value = "";

  if (!title.value.trim()) {
    errorMessage.value = "제목을 입력하세요.";
    return;
  }

  if (!country.value) {
    errorMessage.value = "수출국을 선택하세요.";
    return;
  }

  if (files.value.length === 0) {
    errorMessage.value = "파일을 첨부하세요.";
    return;
  }

  loading.value = true;

  try {
    // 프로젝트 업로드
    const projectResponse = await projectAPI.uploadFile(
      title.value,
      country.value,
      files.value[0].file
    );

    if (projectResponse.success) {
      const projectId = projectResponse.data.id;

      // 파이프라인 실행
      const pipelineResponse = await pipelineAPI.executePipeline(
        projectId,
        "ANALYSIS"
      );

      if (pipelineResponse.success) {
        const pipelineId = pipelineResponse.data.id;
        localStorage.setItem("currentPipelineId", pipelineId);
        localStorage.setItem("currentProjectId", projectId);
        router.push("/review");
      }
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "업로드 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};
</script>
