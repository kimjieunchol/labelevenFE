import { createRouter, createWebHistory } from "vue-router";
import UploadView from "../views/UploadView.vue";
import ResultsView from "../views/ResultsView.vue";
import ReviewView from "../views/ReviewView.vue";
import ReportView from "../views/ReportView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import UserView from "../views/UserView.vue";
import MergeReportView from "../views/MergeReportView.vue";
import FinalReportView from "../views/FinalReportView.vue";
import RawDataView from "../views/RawDataView.vue";

const routes = [
  {
    path: "/",
    redirect: "/upload",
  },
  {
    path: "/upload",
    name: "upload",
    component: UploadView,
    meta: { requiresAuth: true },
  },
  {
    path: "/results",
    name: "results",
    component: ResultsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/review",
    name: "review",
    component: ReviewView,
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
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/user",
    name: "user",
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/merge",
    name: "user-merge",
    component: MergeReportView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/final",
    name: "user-final",
    component: FinalReportView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/raw",
    name: "user-raw",
    component: RawDataView,
    meta: { requiresAuth: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 라우터 가드
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");

  // 인증이 필요한 페이지인데 토큰이 없으면 로그인 페이지로
  if (to.meta.requiresAuth && !token) {
    next("/login");
  }
  // 로그인/회원가입 페이지인데 이미 토큰이 있으면 업로드 페이지로
  else if ((to.path === "/login" || to.path === "/signup") && token) {
    next("/upload");
  } else {
    next();
  }
});
