//TODO: Make sure the ws connection is open before trying to send something

export default {

  /* When the player wants to create a new room */
  createRoom(ws, {roomName, playerName}){
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
  },

  /* When the player needs the list of rooms */
  getRooms(ws){
    var msg = {
      name: 'getRooms'
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
  },

  /* When the player wants to join a room */
  joinRoom(ws, {id, name}){
    var msg = {
      name: 'joinRoom',
      data: {id, name}
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
  },

  /* Pings at 15 second intervals to keep connection alive */
  keepAlive(ws){
    var msg = {
      name: 'ka'
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
  },

  /* When the player wants to start a new round */
  newRound(ws, id){
    var msg = {
      name: 'newRound',
      data: {id}
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
  },

  /* When the player primes or locks in their score */
  scoreChange(ws, {score, status}){
    var msg = {
      name: 'scoreChange',
      data: {
        score,
        status
      }
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
  },

  /* When the plaer wants to update their name */
  updateName(ws, name){
    var msg = {
      name: 'updateName',
      data: {name}
    };
    msg = JSON.stringify(msg);
    ws.send(msg);
  }
}
