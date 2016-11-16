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
        <li><h1>{{room.roomName}}</h1></li>
        <li>
          <button @click="changeDialog('UpdateName')">
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
           v-show="room.roomStatus === 'over'">Average: {{averageScore}}
        </p>
        <button class="new-round"
                @click="newRound"
                v-show="room.roomStatus === 'over'">New Round
        </button>
      </div>
      <div class="numbers-container">
        <p class="hint"
           :class="{'lock-hint': firstClicked}"
           @webkitAnimationEnd=""
           @animationend=""
           @oAnimationEnd="">Tap your choice again to lock it in!
        </p>
        <number-button v-for="score in scores"
                       @select="selectScoreReceiver"
                       :score="score.score"
                       :status="score.status"></number-button>
      </div>
    </div>
  </div>
</template>
<!-- ### -->
<script>
const change = require('../mixins/change.js');
const NumberButton = require('../components/NumberButton.vue');
const wsOut = require('../wsOut.js');

module.exports = {
  components: {
    NumberButton
  },
  computed: {
    /* Generates text to be shown at the top of the screen for the round status */
    roomStatusText(){
      switch(this.room.roomStatus){
        case "ready": return "Ready";
        case "inProgress": return "In Progress";
        case "over": return "Round Over";
      }
    },

    /* Generates the array for the number buttons from availableScores and the selected score */
    scores(){
      var scores = [];
      var statusToAdd = 'available';
      if(this.selectedScore.status === 'submitted'){
        statusToAdd = 'disabled';
      }

      for(let i = 0; i < this.availableScores.length; i++){
        if(this.availableScores[i] === this.selectedScore.score){
          scores[i] = {
            status: this.selectedScore.status,
            score: this.selectedScore.score
          }
        }
        else{
          scores[i] = {
            score: this.availableScores[i],
            status: statusToAdd
          }
        }
      }
      return scores;
    },

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
    }
  },
  //TODO: Encapsulate the event handler registration and deletion
  created(){
    // We have to use use self because this is a different context inside the event handler functions
    var self = this;

    /* Received when first joining a room, and on room creation */
    wsBus.$on('allPlayersUpdate', function(msg){
      self.players = msg.players;
    });

    /* Received when the round is over */
    wsBus.$on('allScores', function(msg){
      for(let i = 0; i < msg.scores.length; i++){
        for(let j = 0; j < self.players.length; j++){
          if(self.players[j].id === msg.scores[i].id){
            self.players[j].score = msg.scores[i].score;
            self.players[j].status = 'over';
          }
        }
      }
    });

    /* Received when a player changes their name */
    wsBus.$on('nameUpdate', function(msg){
      for(let i = 0; i < self.players.length; i++){
        if(self.players[i].id === msg.id) self.players[i].name = msg.name;
      }
    });

    /* Received when the player or a different player primes or locks in their score */
    wsBus.$on('playerStatusUpdate', function(msg){
      for(let i = 0; i < self.players.length; i++){
        if(self.players[i].id === msg.id){
          self.players[i].status = msg.status;
        }
      }
    });

    /* Received when a player leaves the room */
    wsBus.$on('playerQuit', function(msg){
      for(let i = 0; i < self.players.length; i++){
        if(self.players[i].id === msg.id){
          self.players.splice(i, 1);
        }
      }
    })

    /* Received when a new player joins the room */
    wsBus.$on('playersUpdate', function(msg){
      self.players.push(msg.player);
    })

    /* Received when the round status updates */
    wsBus.$on('roundUpdate', function(msg){
      if(msg.status === 'ready'){
        for(let i = 0; i < self.players.length; i++){
          self.players[i].status = '';
          self.players[i].score = null;
        }
        self.selectedScore.status = '';
        self.selectedScore.score = '';
      }
    });
  },
  data () {
    return {
      // The scores available for the user to select
      availableScores: [1, 2, 3, 5, 8, 13, 20, 40, 100],
      // To show the lock hint the first time a player clicks a button
      firstClicked: false,
      // List of all the players in the room
      players: [],
      // The user's currently selected score and its status (primed or locked)
      selectedScore: {status: '', score: null},
    }
  },
  destroyed(){
    wsBus.$off('allPlayersUpdate');
    wsBus.$off('allScores');
    wsBus.$off('nameUpdate');
    wsBus.$off('playerStatusUpdate');
    wsBus.$off('playerQuit');
    wsBus.$off('playersUpdate');
    wsBus.$off('roundUpdate');
  },
  methods: {
    /* This sends the message to start a new round */
    newRound(){
      wsOut.newRound(this.ws, this.room.roomId);
    },

    /* This sets the selectedScore and status accordingly when a player chooses a score */
    selectScoreReceiver(score){
      if(!this.firstClicked)this.firstClicked = true;
      if(this.selectedScore.score === score){
        if(this.selectedScore.status === 'primed') this.selectedScore.status = 'submitted';
        else if(this.selectedScore.status !== 'submitted') this.selectedScore.status = 'primed';
      }
      else this.selectedScore.status = 'primed';
      this.selectedScore.score = score;
      wsOut.scoreChange(this.ws, {score, status: this.selectedScore.status});
    }
  },
  mixins: [change],
  mounted () {},
  props: ['ws', 'room']
}
</script>
