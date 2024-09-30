import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/pages/landing/HomePage.vue";
import NotFoundPage from "@/pages/error/NotFoundPage.vue";

Vue.use(Router);

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      layout: "landing",
      title: "UMG :: Investigación de Operaciones",
    },
  },
  {
    path: "*",
    name: "error",
    component: NotFoundPage,
    meta: {
      layout: "landing",
    },
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL || "/",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes,
});

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  return next();
});

/**
 * After each route update
 */
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  Vue.nextTick(() => {
    document.title = to.meta.title || "Default Title";
  });
});

export default router;
