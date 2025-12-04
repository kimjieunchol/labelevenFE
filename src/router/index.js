import { createRouter, createWebHistory } from 'vue-router';
import UploadView from '../views/UploadView.vue';
import ResultsView from '../views/ResultsView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';

const routes = [
  { path: '/', name: 'upload', component: UploadView },
  { path: '/results', name: 'results', component: ResultsView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
