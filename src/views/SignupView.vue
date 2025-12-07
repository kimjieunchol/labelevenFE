<template>
  <div class="auth-wrap">
    <div class="auth-left"></div>
    <div class="auth-panel">
      <div class="auth-card">
        <h2 class="auth-title">회원가입</h2>
        <form class="auth-form" @submit.prevent="handleSignup">
          <div class="auth-field">
            <label for="name">이름</label>
            <input
              id="name"
              v-model="username"
              type="text"
              placeholder="이름을 입력하세요"
              required
            />
          </div>
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
          <div class="auth-field">
            <label for="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              v-model="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
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
            <span class="signup-link" @click="goLogin">로그인</span>
            <button type="submit" class="primary-btn" :disabled="loading">
              {{ loading ? "회원가입 중..." : "회원가입" }}
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
const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const loading = ref(false);
const errorMessage = ref("");

const handleSignup = async () => {
  errorMessage.value = "";

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  loading.value = true;

  try {
    const response = await authAPI.register(
      username.value,
      email.value,
      password.value
    );

    if (response.success) {
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } else {
      errorMessage.value = response.message || "회원가입에 실패했습니다.";
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>
