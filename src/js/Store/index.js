import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import {
  SET_ROOMID,
  SET_ROOMNAME,
  SET_ROOMSTATUS,
  SET_SCORE
} from 'Store/mutations';

const store = new Vuex.Store({
  state: {
    players: [],
    score: null,
    roomId: null,
    roomName: null,
    roomStatus: null
  },
  mutations: {
    [ADD_PLAYER](state, newPlayer){
      state.players.push(newPlayer);
    },
    [SET_ROOMID](state, newId){
      state.roomId = newId;
    },
    [SET_ROOMNAME](state, newName){
      state.roomName = newName;
    },
    [SET_ROOMSTATUS](state, newStatus){
      state.roomStatus = newStatus;
    },
    [SET_SCORE](state, newScore){
      state.score = newScore;
    }
  }
});
export default store;
