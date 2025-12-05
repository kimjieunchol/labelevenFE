<template>
  <div class="auth-wrap">
    <div class="auth-left"></div>
    <div class="auth-panel">
      <div class="auth-card">
        <h2 class="auth-title">회원가입</h2>
        <form class="auth-form" @submit.prevent="goUpload">
          <div class="auth-field">
            <label for="name">이름</label>
            <input id="name" type="text" placeholder="이름을 입력하세요" required />
          </div>
          <div class="auth-field">
            <label for="email">이메일</label>
            <input id="email" type="email" placeholder="이메일을 입력하세요" required />
          </div>
          <div class="auth-field">
            <label for="password">비밀번호</label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요" required />
          </div>
          <div class="auth-field">
            <label for="passwordConfirm">비밀번호 확인</label>
            <input id="passwordConfirm" type="password" placeholder="비밀번호를 다시 입력하세요" required />
          </div>
          <div class="auth-actions auth-actions-row">
            <span class="signup-link" @click="goLogin">로그인</span>
            <button type="submit" class="primary-btn">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goUpload = () => {
  router.push('/');
};

const goLogin = () => {
  router.push('/login');
};
</script>
