import Vue from 'vue';
import router from './router';
import store from 'Store';
import {roundUpdate, updateRoom} from 'WebSocket/streams';

import fontLoad from './fontLoad';
fontLoad();

// Component loading and put in objects so they can be called by string name later
import Create from 'Dialogs/Create.vue';
import Join from 'Dialogs/Join.vue';
import UpdateName from 'Dialogs/UpdateName.vue';

/* Main app instance */
var app = new Vue({
  router,
  store,
  el: '#app'
});
