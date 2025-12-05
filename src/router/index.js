import { createRouter, createWebHistory } from 'vue-router';
import UploadView from '../views/UploadView.vue';
import ResultsView from '../views/ResultsView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import ReviewView from '../views/ReviewView.vue';
import ReportView from '../views/ReportView.vue';
import UserView from '../views/UserView.vue';
import MergeReportView from '../views/MergeReportView.vue';
import FinalReportView from '../views/FinalReportView.vue';

const routes = [
  { path: '/', name: 'upload', component: UploadView },
  { path: '/review', name: 'review', component: ReviewView },
  { path: '/results', name: 'results', component: ResultsView },
  { path: '/report', name: 'report', component: ReportView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView },
  { path: '/user', name: 'user', component: UserView },
  { path: '/user/merge', name: 'merge-report', component: MergeReportView },
  { path: '/user/final', name: 'final-report', component: FinalReportView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
