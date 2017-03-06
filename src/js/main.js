import Vue from 'vue';
import router from './router';
import store from 'Store';

import fontLoad from './fontLoad';
fontLoad();

/* Main app instance */
var app = new Vue({
  router,
  store,
  el: '#app'
});
