<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <dialog-box>
    <!-- If the WS connection is set up -->
    <template v-if="isWsActive">
      <h2>Join Room</h2>
      <ul v-if="rooms.length">
        <li v-for="room in rooms"
            @click="joinRoom(room.id)">{{room.name}}
        </li>
      </ul>
      <template v-else>
        <p>There are no rooms to join<br>
          Why not <a @click="$router.push('create')">make a new one?</a>
        </p>
      </template>
      <button @click="$router.go(-1)">Cancel</button>
    </template>
    <!-- If the WS connection is not set up -->
    <template v-else>
      <h2>Could Not Connect</h2>
    </template>
  </dialog-box>
</template>
<!-- ### -->
<script>
import {roomsListUpdate} from 'WebSocket/streams';
import DialogBox from 'Components/DialogBox.vue';
import playerName from 'Mixins/playername';
import ws from 'WebSocket';
import {getRooms, joinRoom} from 'WebSocket/wsOut';

export default {
  components: {
    DialogBox
  },
  computed: {
    isWsActive(){
      return true;
    }
  },
  created(){
    var self = this;
    getRooms(ws);
    /* Received when the player needs the list of rooms */
    roomsListUpdate.subscribe( ({data}) => this.rooms = data.rooms);
  },
  data(){
    return {
      rooms: []
    }
  },
  methods: {
    joinRoom(roomId){
      joinRoom(ws, {id: roomId, name: this.playerName});
    }
  },
  mixins: [playerName]
}
</script>
