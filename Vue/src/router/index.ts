import { createRouter, createWebHistory } from 'vue-router';
import DataGridView from '../views/DataGridView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DataGridView,
    },
  ],
});

export default router;
