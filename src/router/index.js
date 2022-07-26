import { createRouter, createWebHistory } from "vue-router";
import UploadPage from "../views/UploadPage.vue";

const routes = [
  {
    path: "/",
    name: "UploadPage",
    component: UploadPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
