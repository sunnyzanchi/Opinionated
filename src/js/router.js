import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Intro from 'Pages/Intro.vue';
import Round from 'Pages/Round.vue';
import Settings from 'Pages/Settings.vue';

import Create from 'Dialogs/Create.vue';
import Join from 'Dialogs/Join.vue';

const routes = [
  {
    path: '/',
    component: Intro,
    children: [
      {
        path: 'create',
        component: Create
      },
      {
        path: 'join',
        component: Join
      }
    ]
  },
  {
    name: 'room',
    path: '/room/:roomName',
    component: Round
  },
  {path: '/settings', component: Settings}
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
