'use strict';
const uuid = require('node-uuid');
const createRoom = require('./roomFactory');
const createPlayer = require('./playerFactory');
const helpers = require('./helpers');

const wsMsg = {

  /* When a client wants to create a new room */
  createRoom(ws, msg, m){
    var createRoomId = uuid.v4();
    var playerId = uuid.v4();

    var newRoom = createRoom(createRoomId, msg.data.room.name);
    var initialPlayer = createPlayer(playerId, msg.data.player.name, newRoom, ws);
    newRoom.players.push(initialPlayer);
    m.rooms.push(newRoom);

    var createRoomResponse = {
      id: createRoomId,
      name: msg.data.room.name,
      status: 'ready'
    }
    //We let the client know the room was created and they joined it
    helpers.updateRoom(ws, createRoomResponse);
    //Client needs the list of all the players in the room, which is just them
    helpers.allPlayersUpdate(ws, newRoom.players);
  },

  /* If message from client isn't a JSON string */
  errorInvalidJSON(ws){
    var response = {
      name: 'errorInvalidJSON',
      data: {
        error: 'Invalid message received. Message should be serialized in JSON format'
      }
    }
    response = JSON.stringify(response);
    ws.send(response);
  },

  /* Invalid name in JSON message from client */
  errorInvalidName(ws, msg){
    var response = {
      name: 'errorInvalidName',
      data: {
        error: `Invalid message name '${msg.name}'`
      }
    }
    response = JSON.stringify(response);
    ws.send(response);
  },

  /* When a client needs the room list */
  getRooms(ws, msg, m){
    var response = {
      name: 'roomsListUpdate',
      data: {
        rooms: []
      }
    };
    //Can't send the rooms array directly, it contains ws objects
    // and other info the client doesn't need/shouldn't get
    for(var i of m.rooms){
      response.data.rooms.push({
        id: i.id,
        name: i.name,
        roomStatus: i.roomStatus
      });
    }
    response = JSON.stringify(response);
    ws.send(response);
  },

  /* When a client wants to join a room */
  joinRoom(ws, msg, m){
    var response;
    var playerId = uuid.v4();

    //Find the room they want to join
    for(let i of m.rooms){
      if (i.id === msg.data.id){
        //Once we find the room, add the player
        // with their WebSocket connection (ws) to the room
        var newPlayer = createPlayer(playerId, msg.data.name, i, ws);
        i.players.push(newPlayer);

        //Let the client know they joined the room successfully
        helpers.updateRoom(ws, i);

        //Build the object to let the other clients know a new player joined
        response = {
          name: 'playersUpdate',
          data: {
            player: {
              name: msg.data.name,
              id: playerId,
              score: null,
              status: 'ready'
            }
          }
        };
        response = JSON.stringify(response);
        for(let j of i.players){
          //Send to all clients except the newly joined one,
          // they get a complete list later
          if(j.ws !== ws){
            j.ws.send(response);
          }
        }
        //Send complete list to newly joined client
        helpers.allPlayersUpdate(ws, i.players);
      }
    }
  },

  /* Keep alive */
  ka(){
    return;
  }

  /* When a client wants to start a new round */
  newRound(ws, msg, m){
    for(let i of m.rooms){
      if(i.id === msg.data.id){
        i.status = 'ready';
      }
      for(let j of i.players){
        j.score = null;
        j.status = 'ready';
      }
    }
  },

  /* When a client locks in their score*/
  scoreChange(ws, msg, m){
    //Find room the client is in
    for(let i of m.rooms){
      let sendAll = true;
      let id;
      let roomId;
      //Find client
      for(let j of i.players){
        if(ws === j.ws){
          j.score = msg.data.score;
          j.status = msg.data.status;
          id = j.id;
          roomId = i.id;
          if(i.status === 'ready'){
            i.status = 'inProgress';
          }
        }
      }
      //If all players aren't submitted yet, don't send all scores
      for(let j of i.players){
        if(j.status !== 'submitted'){
          sendAll = false;
        }
      }
      //If all players have submitted, update the round to be over
      // and send the scores to all players
      if(sendAll){
        i.status = 'over';
        for(let j of i.players){
          helpers.sendAllScores(j.ws, m, roomId);
        }
      }
      else{
        //We don't send the scores one by one, just the statuses
        //That way no one can know the scores until all players are locked in
        for(let j of i.players){
          helpers.playerStatusUpdate(j.ws, msg.data.status, id);
        }
      }
    }
  },

  /* When a client wants to change their display name */
  updateName(ws, msg, m){
    for(let i of m.rooms){
      for(let j of i.players){
        if(ws === j.ws){
          j.name = msg.data.name;
        }
      }
    }
  },
}

module.exports = wsMsg;
