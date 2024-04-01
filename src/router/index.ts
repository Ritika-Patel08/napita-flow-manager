import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Settings from "@/views/Settings.vue"
import { useUserStore } from '@/store/user';
import { showToast } from '@/utils'
import 'vue-router'
import { useAuthStore, translate } from '@hotwax/dxp-components'
import Login from "@/views/Login.vue"
import Tabs from '@/components/Tabs.vue';
import { computed } from 'vue';

// Defining types for the meta values
declare module 'vue-router' {
  interface RouteMeta {
    permissionId?: string;
  }
}

const loginGuard = (to: any, from: any, next: any) => {
  const userStore = useUserStore()
  if (!userStore.isAuthenticated) {
    next()
  } else {
    next("/")
  }
};
const authGuard = (to: any, from: any, next: any) => {
  const userStore = useUserStore()
  
  // const isAuthenticated = computed(() => userStore.isAuthenticated)
  // console.log(isAuthenticated);
  
  if (userStore.isAuthenticated) {
    next()
  } else {
    next("/login")
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/settings'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loginGuard

  },
  {
    path: '/tabs',
    component: Tabs,
    children: [
      {
        path: 'process',
        component: () => import('@/views/ProcessGroupStatus.vue'),
      },{
        path: 'settings',
        component: () => import('@/views/Settings.vue')
      },
    ],
    beforeEnter: authGuard,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   authGuard(to, from, next); 
// });

export default router
