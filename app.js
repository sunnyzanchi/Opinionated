const favicon = require('serve-favicon');
const express = require('express');
const path = require('path');
const app = express();
const expressWs = require('express-ws')(app);

/*  Handles incoming Websocket messages
    Methods prefixed with an underscore are private */
const wsMsg = require('./wsMsg');

/* Model */
var model = {
  rooms: []
};

/* Public */
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/* Routes */
//Index
app.get('/', function(req, res, next){
  const options = {
    root: './views'
  };
  res.sendFile('main.html', options);
});

//WebSocket
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    try{
      msg = JSON.parse(msg);
    }
    catch(e){
      wsMsg.errorInvalidJSON(ws);
      return;
    }
    //Make sure it's a valid message
    if(typeof wsMsg[msg.name] === 'function'){
      wsMsg[msg.name](ws, msg, model); //All functions from wsMsg take args in the same order
    }
    else{
      wsMsg.errorInvalidName(ws, msg);
    }

  });
  ws.on('close', function(){
    //Find which room the client is in
    for(let i of model.rooms){
      let newPlayers = [];
      let response = {
        name: 'playerQuit',
        data: {}
      };
      //Find which player is quitting
      for(let j of i.players){
        if(j.ws !== ws){
          newPlayers.push(j);
        }
        else{
          //Save id to send to the other clients so they can remove the quitter
          response.data.id = j.id;
        }
      }
      i.players = newPlayers;
      //Send to the rest of the clients
      response = JSON.stringify(response);
      for(let j of i.players){
        j.ws.send(response);
      }
    }
  });
});

/* Start server */
app.listen(process.env.PORT || 3000);
