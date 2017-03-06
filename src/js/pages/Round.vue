<style lang="css">
  .round-container{
    height: 100%;
  }
</style>
<!-- ### -->
<template lang="html">
  <div class="round-container">
    <nav>
      <ul>
        <li><h1>{{$route.params.roomName}}</h1></li>
        <li>
          <button @click="$router.push('settings')">
            <i class="material-icons">settings</i>
          </button>
        </li>
      </ul>
    </nav>
    <div class="container">
      <div class="stats-container">
        <h2>{{roomStatusText}}</h2>
        <table>
          <tbody>
            <tr v-for="player in players">
              <td>{{player.name}}</td>
              <td>
                <i class="material-icons" v-show="player.status === 'primed'">lock_open</i>
                <i class="material-icons" v-show="player.status === 'submitted'">lock_outline</i>
                <span v-show="player.score">{{player.score}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="stats"
           v-show="roomStatus === 'over'">Average: {{averageScore}}
        </p>
        <button class="new-round"
                @click="newRound"
                v-show="roomStatus === 'over'">New Round
        </button>
      </div>
      <ButtonGroup :scores="availableScores" />
    </div>
  </div>
</template>
<!-- ### -->
<script>
import ButtonGroup from 'Components/ButtonGroup.vue';
import {
  SET_ROOMID,
  SET_ROOMNAME,
  SET_ROOMSTATUS
} from 'Store/mutations';
import {
  allPlayersUpdate,
  allScores,
  nameUpdate,
  playerStatusUpdate,
  playerQuit,
  playersUpdate,
  roundUpdate,
  updateRoom
} from 'WebSocket/streams';
import playerName from 'Mixins/playerName';
import ws from 'WebSocket';
import * as wsOut from 'WebSocket/wsOut';

export default {
  components: {
    ButtonGroup
  },
  computed: {
    /* Generates the average score and coalesces to the nearest number in the available scores */
    averageScore(){
      var scoresTotal = 0;
      var numOfScores = 0;
      for(let i = 0; i < this.players.length; i++){
        scoresTotal += this.players[i].score;
        numOfScores++;
      }

      // This is the real average
      var actualAverage = scoresTotal / numOfScores;

      // This finds the score closest to the real average
      var distance = Infinity;
      var closest;
      for(let i = 0; i < this.availableScores.length; i++){
        if(Math.abs(this.availableScores[i] - actualAverage) <= distance){
          distance = Math.abs(this.availableScores[i] - actualAverage);
          closest = this.availableScores[i];
        }
      }
      return closest;
    },

    isLocked(){
      return this.selectedScore.status === 'locked';
    },

    /* Generates text to be shown at the top of the screen for the round status */
    roomStatusText(){
      switch(this.roomStatus){
        case "ready": return "Ready";
        case "inProgress": return "In Progress";
        case "over": return "Round Over";
      }
    },
    roomId(){
      return this.$store.roomId;
    },
    roomName(){
      return this.$store.roomName;
    },
    roomStatus(){
      return this.$store.roomStatus;
    }
  },
  created(){
    // We have to use use self because this is a different context inside the event handler functions
    const self = this;
    this.$store.commit(SET_ROOMNAME, this.$route.params.roomName);

    wsOut.createRoom(ws, {
      roomName: this.roomName,
      playerName: this.playerName
    });

    /* Received when first joining a room, and on room creation */
    allPlayersUpdate.subscribe(({data}) => this.players = data.players);

    /* Received when the round is over */
    allScores.subscribe(function({data}){
      for(let i = 0; i < data.scores.length; i++){
        for(let j = 0; j < self.players.length; j++){
          if(self.players[j].id === data.scores[i].id){
            self.players[j].score = data.scores[i].score;
            self.players[j].status = 'over';
          }
        }
      }
    });

    /* Received when a player changes their name */
    nameUpdate.subscribe(function({data}){
      for(let i = 0; i < self.players.length; i++){
        if(self.players[i].id === data.id) self.players[i].name = msg.name;
      }
    });

    /* Received when the player or a different player primes or locks in their score */
    playerStatusUpdate.subscribe(function({data}){
      for(let i = 0; i < self.players.length; i++){
        if(self.players[i].id === data.id){
          self.players[i].status = data.status;
        }
      }
    });

    /* Received when a player leaves the room */
    playerQuit.subscribe(function({data}){
      for(let i = 0; i < self.players.length; i++){
        if(self.players[i].id === data.id){
          self.players.splice(i, 1);
        }
      }
    })

    /* Received when a new player joins the room */
    playersUpdate.subscribe(function({data}){
      self.players.push(data.player);
    })

    /* Received when the round status updates */
    roundUpdate.subscribe(function({data}){
      self.roomStatus = data.status;
      if(data.status === 'ready'){
        for(let i = 0; i < self.players.length; i++){
          self.players[i].status = null;
          self.players[i].score = null;
        }
        self.selectedScore.status = null;
        self.selectedScore.score = null;

        for(let child of self.$children){
          child.reset();
        }
      }
    });

    updateRoom.subscribe(function({data}){
      // Set room properties to new room
      self.$store.commit(SET_ROOMID, data.room.id);
      self.$store.commit(SET_ROOMNAME, data.room.name);
      self.$store.commit(SET_ROOMSTATUS, data.room.status);
    });
  },
  data(){
    return {
      // The scores available for the user to select
      availableScores: [1, 2, 3, 5, 8, 13, 20, 40, 100],
      // To show the lock hint the first time a player clicks a button
      firstClicked: false,
      // List of all the players in the room
      players: [],
      // The user's currently selected score
      selectedScore: {score: null, status: 'available'}
    }
  },
  methods: {
    /* This sends the message to start a new round */
    newRound(){
      wsOut.newRound(ws, this.roomId);
    },

    /* This sets the selectedScore when a player chooses a score */
    selectScoreReceiver({score, status}){
      if(!this.firstClicked)this.firstClicked = true;

      if(this.selectedScore !== score){
        this.resetChildren();
      }
      this.selectedScore = {score, status};
      wsOut.scoreChange(ws, {score, status});
    }
  },
  mixins: [playerName]
}
</script>
