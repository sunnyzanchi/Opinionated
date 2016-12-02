/* Opinionated 2.1.0 */
/* Eric Zanchi       */
/* ################# */

const Vue = require('vue');
// The Websocket Bus emits events when a WS message is received
// Components that need the information have listeners for each event
// It needs to be a property on the window object instead of a var
//  because the components can't see it otherwise
window.wsBus = new Vue();

// Component loading and put in objects so they can be called by string name later
const dialogs = {
  Create: require('./dialogs/Create.vue'),
  Join: require('./dialogs/Join.vue'),
  UpdateName: require('./dialogs/UpdateName.vue')
};
const pages = {
  Intro: require('./pages/Intro.vue'),
  Round: require('./pages/Round.vue')
};
// Component registration
for(let dialog in dialogs){
  Vue.component(dialog);
}
for(let page in pages){
  Vue.component(page);
}

/* Main app instance */
/* ################# */
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
require('./initws.js')(app);

// This forces Roboto 300 to load as soon as the page loads
// Otherwise, it would wait to download it until some DOM with Roboto font was rendered
// This can cause it to jitter or even not show the text under slow network conditions
(function fontForceLoad(){
  var font = new FontFace('Roboto', 'url(https://fonts.gstatic.com/s/roboto/v15/Hgo13k-tfSpn0qi1SFdUfVtXRa8TVwTICgirnJhmVJw.woff2)', {});
  font.load().then(function(){
    document.fonts.add(font);
  });
}());
