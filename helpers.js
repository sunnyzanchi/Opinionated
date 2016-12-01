'use strict';
const helpers = {
  /* Send complete list of players */
  allPlayersUpdate(ws, players){
    var response = {
          name: 'allPlayersUpdate',
          data: {
            players: []
          }
        };
    //Add all the players to the list
    for(let i of players){
      response.data.players.push({
        name: i.name,
        id: i.id,
        score: null,
        status: i.status
      });
    }
    response = JSON.stringify(response);
    ws.send(response);
  },

  /* Send player status update */
  playerStatusUpdate(ws, status, playerId){
    var response = {
      name: 'playerStatusUpdate',
      data: {
        status: status,
        id: playerId
      }
    };
    response = JSON.stringify(response);
    ws.send(response);
  },

  /*  Update round status
      Valid status values are ready, inProgress, over */
  roundUpdate(ws, status){
    var response = {
      name: 'roundUpdate',
      data: {
        status: status
      }
    };
    response = JSON.stringify(response);
    ws.send(response);
  },

  /* Send all player scores */
  sendAllScores(ws, m, roomId){
    var response = {
      name: 'allScores',
      data: {
        scores: []
      }
    };
    //Find which room it is
    for(let i of m.rooms){
      if(i.id === roomId){
        //Get all the player scores and their ids
        for(let j of i.players){
          response.data.scores.push({
            id: j.id,
            score: j.score
          });
        }
      }
    }
    response = JSON.stringify(response);
    ws.send(response);
  },

  /* Let the client know they joined the room successfully */
  updateRoom(ws, data){
    var response = {
      name: 'updateRoom',
      data: {
        room: {
          id: data.id,
          name: data.name,
          status: data.status
        },
        status: 'success',
      }
    };
    response = JSON.stringify(response);
    ws.send(response);
  }
};

module.exports = helpers;
