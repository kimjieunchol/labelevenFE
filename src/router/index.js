import { createRouter, createWebHistory } from "vue-router";
import UploadView from "../views/UploadView.vue";
import ResultsView from "../views/ResultsView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import ReviewView from "../views/ReviewView.vue";
import ReportView from "../views/ReportView.vue";
import UserView from "../views/UserView.vue";
import MergeReportView from "../views/MergeReportView.vue";
import FinalReportView from "../views/FinalReportView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/upload",
    name: "upload",
    component: UploadView,
    meta: { requiresAuth: true },
  },
  {
    path: "/review",
    name: "review",
    component: ReviewView,
    meta: { requiresAuth: true },
  },
  {
    path: "/results",
    name: "results",
    component: ResultsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/report",
    name: "report",
    component: ReportView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
    meta: { requiresAuth: false },
  },
  {
    path: "/user",
    name: "user",
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/merge",
    name: "merge-report",
    component: MergeReportView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/final",
    name: "final-report",
    component: FinalReportView,
    meta: { requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    // 인증이 필요한데 토큰이 없으면 로그인으로
    next("/login");
  } else if ((to.name === "login" || to.name === "home") && token) {
    // 이미 로그인했는데 로그인 페이지 접근 시 업로드로
    next("/upload");
  } else {
    // 그 외는 정상 진행
    next();
  }
});
