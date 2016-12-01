'use strict';
const helpers = require('./helpers');

function createRoom(id, name){
  return {
    id: id,
    name: name,
    players: [],
    _status: 'ready',
    get status(){return this._status;},
    //We use a getter and setter with a private _status property
    //We never modify _status directly, but when we set status,
    // it sends the status update to all the players in the room
    set status(a){
      this._status=a;
      for(let i of this.players){
        helpers.roundUpdate(i.ws, a);
      }
    }
  };

}

module.exports = createRoom;
