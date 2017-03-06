//TODO: Make sure the ws connection is open before trying to send something

  /* When the player wants to create a new room */
export function createRoom(ws, {roomName, playerName}){
  var msg = {
    name: 'createRoom',
    data: {
      room:{
        name: roomName
      },
      player: {
       name: playerName
      }
    }
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}

  /* When the player needs the list of rooms */
export function getRooms(ws){
  var msg = {
    name: 'getRooms'
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}

  /* When the player wants to join a room */
export function joinRoom(ws, {id, name}){
  var msg = {
    name: 'joinRoom',
    data: {id, name}
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}

/* Pings at 15 second intervals to keep connection alive */
export function keepAlive(ws){
  var msg = {
    name: 'ka'
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}

/* When the player wants to start a new round */
export function newRound(ws, id){
  var msg = {
    name: 'newRound',
    data: {id}
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}

/* When the player primes or locks in their score */
export function scoreChange(ws, {score, status}){
  var msg = {
    name: 'scoreChange',
    data: {
      score,
      status
    }
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}

/* When the player wants to update their name */
export function updateName(ws, name){
  var msg = {
    name: 'updateName',
    data: {name}
  };
  msg = JSON.stringify(msg);
  ws.send(msg);
}
