<template>
  <div class="auth-wrap">
    <div class="auth-left"></div>
    <div class="auth-panel">
      <div class="auth-card">
        <h2 class="auth-title">로그인</h2>
        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="auth-field">
            <label for="email">이메일</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div class="auth-field">
            <label for="password">비밀번호</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <div
            v-if="errorMessage"
            style="color: red; font-size: 14px; margin-bottom: 10px"
          >
            {{ errorMessage }}
          </div>
          <div class="auth-actions auth-actions-row">
            <span class="signup-link" @click="goSignup">회원가입</span>
            <button type="submit" class="primary-btn" :disabled="loading">
              {{ loading ? "로그인 중..." : "로그인" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authAPI } from "../services/api";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await authAPI.login(email.value, password.value);

    if (response.success) {
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } else {
      errorMessage.value = response.message || "로그인에 실패했습니다.";
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

const goSignup = () => {
  router.push("/signup");
};
</script>
