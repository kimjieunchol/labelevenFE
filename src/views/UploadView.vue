<template>
  <div class="upload-wrap">
    <div class="upload-card">
      <h2 class="upload-title">문서 업로드</h2>
      <div class="upload-form">
        <div class="form-row">
          <div class="form-label">제목</div>
          <input class="form-input" type="text" placeholder="업로드할 문서 제목을 입력하세요" />
        </div>
        <div class="form-row">
          <div class="form-label">수출국</div>
          <div class="select-wrap">
            <select class="form-select">
              <option disabled selected>나라를 선택하세요</option>
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
                multiple
                @change="onFileSelect"
              />
            </div>
            <div
              class="upload-drop"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
              :class="[{ 'drop-active': dragOver, 'drop-has-files': files.length }]"
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
                          <span class="file-remove" @click="removeFile(file.name)">✕</span>
                          <span>{{ file.name }}</span>
                        </td>
                        <td>{{ file.size }}</td>
                        <td>대기</td>
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
          <button class="primary-btn" @click="goResults">결과 확인하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dragOver = ref(false);
const files = ref([]);

const formatSize = (bytes) => {
  if (bytes === 0 || isNaN(bytes)) return '0KB';
  const kb = bytes / 1024;
  return `${kb.toFixed(2)}KB`;
};

const addFiles = (fileList) => {
  const incoming = Array.from(fileList).map((f) => ({
    name: f.name,
    size: formatSize(f.size),
  }));
  files.value = [...files.value, ...incoming];
};

const onFileSelect = (e) => {
  addFiles(e.target.files || []);
  e.target.value = '';
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

const goResults = () => {
  router.push('/results');
};
</script>
