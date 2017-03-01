import Vue from 'vue';
import wsBus from 'WebSocket/wsBus';

import fontLoad from './fontLoad';
fontLoad();

// Component loading and put in objects so they can be called by string name later
import Create from 'Dialogs/Create.vue';
import Join from 'Dialogs/Join.vue';
import UpdateName from 'Dialogs/UpdateName.vue';

const dialogs = {
  Create,
  Join,
  UpdateName
};

import Intro from 'Pages/Intro.vue';
import Round from 'Pages/Round.vue';

const pages = {
  Intro,
  Round
};
// Component registration
for(let dialog in dialogs){
  Vue.component(dialog);
}
for(let page in pages){
  Vue.component(page);
}

/* Main app instance */
var app = new Vue({
  el: '#app',
  created(){
    var self = this;

    /* Received when a player joins a room */
    wsBus.$on('updateRoom', function(msg){
      // Set room properties to new room
      self.room.roomId = msg.room.id;
      self.room.roomName = msg.room.name;
      self.room.roomStatus = msg.room.status;
      // Close dialog and switch to the Round page
      self.changePageReciever('Round');
      self.changeDialogReceiver('close');
    });

    /* Received when the round enters a new state */
    wsBus.$on('roundUpdate', function(msg){
      self.room.roomStatus = msg.status;
    });
  },
  data: {
    // The current page of the app
    page: pages.Intro,
    // The currently open dialog box
    dialog: '',
    // Information about the current room
    room: {
      roomId: '',
      roomName: '',
      roomStatus: ''
    },
    // The ws connection. It's passed into components via the props interface
    ws: 0
  },
  destroyed(){
    wsBus.$off('updateRoom');
  },
  methods: {
    // Receiver methods are the methods behind the event listeners
    // ie the changepage event calls the changePageReciever
    changePageReciever(pageName){
      this.page = pages[pageName];
    },
    changeDialogReceiver(dialogName){
      if(dialogName === 'close') this.dialog = '';
      else this.dialog = dialogs[dialogName];
    }
  }
});

// This handles setting up the app's WebSocket connection
import initWs from 'WebSocket/initws';
initWs(app);
