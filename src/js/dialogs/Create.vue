<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <div class="modal-container">
    <div class="modal">
      <!-- If the WS connection is set up -->
      <template v-if="ws">
        <h2>Create New Room</h2>
        <div class="modal-content">
          <label for="create">Room Name</label>
          <input type="text"
                 id="create"
                 ref="roomInput"
                 @keyup.enter="createRoom"
                 v-model="roomName">
        </div>
        <div class="button-inliner">
          <button @click="closeDialog">Cancel</button>
          <button @click="createRoom">Create</button>
        </div>
      </template>
      <!-- If the WS connection is not set up -->
      <template v-else>
        <h2>Could Not Connect</h2>
      </template>
    </div>
  </div>
</template>
<!-- ### -->
<script>
const Vue = require('vue');
const change = require('../mixins/change.js');
const playerName = require('../mixins/playername.js');
const wsOut = require('../wsOut.js');

module.exports = {
  components: {},
  computed: {},
  created(){
    var self = this;

    // Set focus to the input
    // We have to do this inside a nextTick function,
    //  because the input is conditionally rendered, which is done asynchronously
    Vue.nextTick(function(){
      // We use self because this is bound to the Vue object inside the function
      self.$refs.roomInput.focus();
    });
  },
  data () {
    return {
      roomName: ''
    };
  },
  destroyed(){
  },
  methods: {
    createRoom(){
      wsOut.createRoom(this.ws, {
        roomName: this.roomName,
        playerName: this.playerName
      });
      this.changePage('Round');
      this.closeDialog();
    }
  },
  mixins: [change, playerName],
  mounted () {},
  props: ['ws']
}
</script>
