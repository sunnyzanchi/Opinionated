<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <div class="modal-container">
    <div class="modal">
      <!-- If the WS connection is set up -->
      <template v-if="ws">
        <h2>Join Room</h2>
        <ul v-if="rooms.length">
          <li v-for="room in rooms"
              @click="joinRoom(room.id)">{{room.name}}
          </li>
        </ul>
        <template v-else>
          <p>There are no rooms to join<br>
            Why not <a href="#" @click="changeDialog('Create')">make a new one?</a>
          </p>
        </template>
        <button @click="closeDialog">Cancel</button>
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
import change from 'Mixins/change';
import playerName from 'Mixins/playername';
import wsBus from 'WebSocket/wsBus';
import wsOut from 'WebSocket/wsOut';

export default {
  components: {},
  computed: {},
  created(){
    var self = this;
    wsOut.getRooms(this.ws);

    /* Received when the player needs the list of rooms */
    wsBus.$on('roomsListUpdate', function(msg){
      // We use self because this is bound to the bus inside the function
      self.rooms = msg.rooms;
    });
  },
  data(){
    return {
      rooms: []
    }
  },
  destroyed(){
    wsBus.$off('roomsListUpdate');
  },
  methods: {
    joinRoom(roomId){
      wsOut.joinRoom(this.ws, {id: roomId, name: this.playerName});
    }
  },
  mixins: [change, playerName],
  props: ['ws']
}
</script>
