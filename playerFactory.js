function createPlayer(id, name, room, ws){
  return {
    _name: name,
    id: id,
    get name(){return this._name;},
    
    //When name is set, it sends the change to everyone else in the same room
    set name(a){
      this._name = a;
      var response = {
        name: "nameUpdate",
        data: {
          id: this.id,
          name: a
        }
      }
      response = JSON.stringify(response);
      for(let i of this.room.players){
        i.ws.send(response);
      }
    },
    status: 'ready',
    /*  Room is a cicular reference. 
        This lets us send ws messages to everyone else in the same room    
    */
    room: room, 
    ws: ws
  };
}


module.exports = createPlayer;