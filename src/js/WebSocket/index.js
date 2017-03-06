import stream from 'WebSocket/streams';
import {keepAlive} from 'WebSocket/wsOut';

var retry;
const ws = createWs();
export default ws;

// Keep Alive
var ka;

// Reset connection retry
if(retry) clearInterval(retry);

ws.onopen = function(e){
  ka = setInterval(keepAlive, 15000, ws);
};

ws.onmessage = function({data}){
  const update = JSON.parse(data);
  stream.onNext(update);

  //Reset keep alive timer
  //TODO: Reset timer when messages are sent, not just received
  clearInterval(ka);
  ka = setInterval(keepAlive, 15000, ws);
};

ws.onclose = function(e){
  clearInterval(ka);
  // TODO: Write reset logic
  //retry = setInterval(initws, 1000, app);
};

/* Sets up connection, ws or wss based on http or https */
function createWs(){
  if(window.location.protocol === 'http:')
    return new WebSocket(`ws://${window.location.host}`);
  if(window.location.protocol === 'https:')
    return new WebSocket(`wss://${window.location.host}`);
}
