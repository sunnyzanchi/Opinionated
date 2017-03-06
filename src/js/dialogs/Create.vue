<style lang="css">
</style>
<!-- ### -->
<template lang="html">
  <dialog-box>
    <!-- If the WS connection is set up -->
    <template v-if="isWsActive">
      <h2>Create New Room</h2>
      <div class="modal-content">
        <label for="create">Room Name</label>
        <input type="text"
               id="create"
               @keyup.enter="createRoom"
               v-model="roomName"
               v-focus>
      </div>
      <div class="button-inliner">
        <button @click="$router.go(-1)">Cancel</button>
        <button @click="createRoom">Create</button>
      </div>
    </template>
    <!-- If the WS connection is not set up -->
    <template v-else>
      <h2>Could Not Connect</h2>
    </template>
  </dialog-box>
</template>
<!-- ### -->
<script>
import {updateRoom} from 'WebSocket/streams';
import DialogBox from 'Components/DialogBox.vue';
import playerName from 'Mixins/playername';
import ws from 'WebSocket';

export default {
  computed: {
    isWsActive(){
      return true;
    }
  },
  components: {
    DialogBox
  },
  data(){
    return {
      roomName: ''
    };
  },
  directives: {
    focus: {
      inserted(el){
        el.focus();
      }
    }
  },
  methods: {
    createRoom(){
      this.$router.push({
        name: 'room',
        params: {roomName: this.roomName}
      });
    }
  },
  mixins: [playerName]
}
</script>
