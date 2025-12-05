<template>
  <div class="user-layout">
    <aside class="user-sidebar">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['user-tab', activeTab === tab.key && 'user-tab-active']"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </div>
    </aside>
    <section class="user-content">
      <div class="user-filters">
        <label
          >제목
          <input
            v-model="titleInput"
            type="text"
            placeholder="제목을 입력하세요"
        /></label>
        <label
          >파일명
          <input
            v-model="fileInput"
            type="text"
            placeholder="파일명을 입력하세요"
        /></label>
        <label>생성일자 <input v-model="dateInput" type="date" /></label>
        <button class="primary-btn filter-btn" @click="applyTableFilters">
          검색
        </button>
      </div>

      <div v-if="loading" class="loading">데이터 로딩 중...</div>

      <div v-else class="user-table">
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>파일명</th>
              <th>용량</th>
              <th>생성 날짜</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="row.id">
              <td>{{ row.title }}</td>
              <td class="file-name-cell">{{ row.filename }}</td>
              <td>{{ row.size }}</td>
              <td>{{ formatDate(row.date) }}</td>
              <td>
                <button class="ghost-btn" @click="viewProject(row.id)">
                  보기
                </button>
                <button class="decline-btn" @click="deleteProject(row.id)">
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { projectAPI } from "../api/api.js";

const router = useRouter();
const loading = ref(false);
const projects = ref([]);

const tabs = [
  { key: "upload-list", label: "업로드한 데이터", route: "/user" },
  { key: "merge-report", label: "정합 보고서", route: "/user/merge" },
  { key: "final-report", label: "최종 보고서", route: "/user/final" },
  { key: "raw-data", label: "원본 데이터", route: "/user/raw" },
];

const activeTab = ref("upload-list");

const titleInput = ref("");
const fileInput = ref("");
const dateInput = ref("");
const appliedTitle = ref("");
const appliedFile = ref("");
const appliedDate = ref("");

onMounted(async () => {
  await loadProjects();
});

const loadProjects = async () => {
  try {
    loading.value = true;
    const response = await projectAPI.getProjects();
    projects.value = response.data?.projects || [];
  } catch (error) {
    console.error("프로젝트 로딩 실패:", error);
    alert("데이터를 불러오는데 실패했습니다.");
  } finally {
    loading.value = false;
  }
};

const switchTab = (key) => {
  const tab = tabs.find((t) => t.key === key);
  if (tab?.route) {
    router.push(tab.route);
  }
  activeTab.value = key;
  resetFilters();
};

const resetFilters = () => {
  titleInput.value = "";
  fileInput.value = "";
  dateInput.value = "";
  appliedTitle.value = "";
  appliedFile.value = "";
  appliedDate.value = "";
};

const applyTableFilters = () => {
  appliedTitle.value = titleInput.value.trim();
  appliedFile.value = fileInput.value.trim();
  appliedDate.value = dateInput.value;
};

const filteredRows = computed(() =>
  projects.value.filter((row) => {
    const matchTitle = appliedTitle.value
      ? row.title.toLowerCase().includes(appliedTitle.value.toLowerCase())
      : true;
    const matchFile = appliedFile.value
      ? (row.filename || "")
          .toLowerCase()
          .includes(appliedFile.value.toLowerCase())
      : true;
    const matchDate = appliedDate.value ? row.date === appliedDate.value : true;
    return matchTitle && matchFile && matchDate;
  })
);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
};

const viewProject = (id) => {
  router.push({ path: "/results", query: { projectId: id } });
};

const deleteProject = async (id) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await projectAPI.deleteProject(id);
    alert("삭제되었습니다.");
    await loadProjects();
  } catch (error) {
    console.error("삭제 실패:", error);
    alert("삭제에 실패했습니다.");
  }
};
</script>
