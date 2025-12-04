<template>
  <div class="review-wrap">
    <div class="review-card">
      <h2 class="review-title">병합 보고서</h2>
      <div class="review-body">
        <p v-for="(line, idx) in mockLines" :key="idx">{{ line }}</p>
      </div>
      <div class="review-actions">
        <button class="decline-btn" @click="goUpload">DECLINE</button>
        <button class="primary-btn" @click="goResults">ALLOW</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const mockLines = [
  '제품명: 해양 스파클링 레몬 350ml',
  '성분: 탄산수, 천연 레몬향, 당류 12g, 나트륨 25mg',
  '알레르겐: 견과류 취급 공장에서 제조 (땅콩, 대두)',
  '첨가물: 보존료 (E211), 천연 색소',
  '유통기한: 제조일로부터 12개월',
  '제조원: 부산 스마트팩토리 (대한민국)',
  '보관: 직사광선을 피해 서늘한 곳에 보관',
  '제품명: 해양 스파클링 레몬 350ml',
  '성분: 탄산수, 천연 레몬향, 당류 12g, 나트륨 25mg',
  '알레르겐: 견과류 취급 공장에서 제조 (땅콩, 대두)',
  '첨가물: 보존료 (E211), 천연 색소',
  '유통기한: 제조일로부터 12개월',
  '제조원: 부산 스마트팩토리 (대한민국)',
  '보관: 직사광선을 피해 서늘한 곳에 보관',
];

const goUpload = () => router.push('/');
const goResults = () => router.push('/results');
</script>
