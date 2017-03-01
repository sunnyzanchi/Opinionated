// TODO: Retry connection if the connection drops

import wsBus from 'WebSocket/wsBus';
import wsOut from 'WebSocket/wsOut';

var retry;
export default function initws(app){
 // Keep Alive
  var ka;

  // Reset connection retry
  if(retry) clearInterval(retry);

  // Sets up connection, ws or wss based on http or https
  if(window.location.protocol === 'http:')
    app.ws = new WebSocket(`ws://${window.location.host}`);
  if(window.location.protocol === 'https:')
    app.ws = new WebSocket(`wss://${window.location.host}`);

  app.ws.onopen = function(e){
      ka = setInterval(wsOut.keepAlive, 15000, app.ws);
    };

  app.ws.onmessage = function(e){
    var msg = JSON.parse(e.data);
    wsBus.$emit(msg.name, msg.data);

    //Reset keep alive timer
    //TODO: Reset timer when messages are sent, not just received
    clearInterval(ka);
    ka = setInterval(wsOut.keepAlive, 15000, app.ws);
  };

  app.ws.onclose = function(e){
    app.ws = null;
    clearInterval(ka);
    retry = setInterval(initws, 1000, app);
  };
};
