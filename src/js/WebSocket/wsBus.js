// The Websocket Bus emits events when a WS message is received
// Components that need the information have listeners for each event
import Vue from 'vue';
const wsBus = new Vue();

export default wsBus;
