/* Opinionated 1.0.0 */
/* Eric Zanchi       */
/* ################# */

/* Opinionated Namespace */
var Opinionated = {
  //model is accessible from everywhere in the application
  model: {
    //Scores to choose from
    availableScores: ko.observableArray([
      {
        lock: ko.observable('notLocked'),
        number: 1
      },
      {
        lock: ko.observable('notLocked'),
        number: 2
      },
      {
        lock: ko.observable('notLocked'),
        number: 3
      },
      {
        lock: ko.observable('notLocked'),
        number: 5
      },
      {
        lock: ko.observable('notLocked'),
        number: 8
      },
      {
        lock: ko.observable('notLocked'),
        number: 13
      },
      {
        lock: ko.observable('notLocked'),
        number: 20
      },
      {
        lock: ko.observable('notLocked'),
        number: 40
      },
      {
        lock: ko.observable('notLocked'),
        number: 100
      }
      ]),
    
    //Average score at the end of each round
    averageScore: ko.pureComputed(function(){
      var scores = 0;
      var numOfScores = 0;
      var actualAverage;
      for(let i of Opinionated.model.players()){
        scores += i.score();
        numOfScores++;
      }
      actualAverage = scores / numOfScores; //This is the real average
      
      //This finds the score closest to the real average
      var distance = Infinity;
      var closest;
      for(var i of Opinionated.model.availableScores()){
        if(Math.abs(i.number - actualAverage) <= distance){
          distance = Math.abs(i.number - actualAverage);
          closest = i.number;
        }
      }
      return closest;
    }),
    
    //Current modal
    modal: {
      css: ko.observable("modal modal-small"),
      template: ko.observable("create-room"),
    },
    
    //Each modal has an object with all of its logic
    modals: {
      createRoom: {
        //Close the modal
        cancel(){
          Opinionated.model.ui.toggleModal();          
        },
        
        //The WebSocket function changes create to createReady
        create: ko.observable(function(){
          ;;console.log("WebSocket connection not set up yet!");
        }),
        createReady(){
          var msg = {
            name: "createRoom",
            data: {
              room:{
                name: Opinionated.model.modals.createRoom.roomName()
              },
              player: {
               name: Opinionated.checkName()
              }
            }
          }
          msg = JSON.stringify(msg);
          Opinionated.ws.send(msg);
        },
        
        //To autofocus on the name field when the box pops up
        focus: ko.observable(false),
        
        //The input field for the new room
        roomName: ko.observable()
      },
      joinRoom: {
        //Close the modal
        cancel(){
          Opinionated.model.ui.toggleModal();
        },
        
        //Gets list of room names and ids from the server
        //WebSocket function changes getRooms to getRoomsReady
        getRooms: ko.observable(function(){
          ;;console.log("WS not set up yet");
        }),
        getRoomsReady(){
          console.log("Getting Rooms");
          var msg = {
            name: "getRooms"
          }
          msg = JSON.stringify(msg);
          Opinionated.ws.send(msg);
        },
        
        //Changes modal to the create modal
        goToCreate(){
          Opinionated.model.modal.template("create-room");
          Opinionated.model.modal.css("modal modal-small");
        },
        
        //Requests to join a room from the server
        //WebSocket function changes join to joinReady
        join: ko.observable(function(){
          ;;console.log("WS not set up yet");
        }),
        joinReady(me){
          console.log("Joining room");
          var msg = {
            name: "joinRoom",
            data: {
              name: Opinionated.checkName(),
              id: me.id
            }
          }
          msg = JSON.stringify(msg);
          Opinionated.ws.send(msg);
        },
            
      }
    },
    
    //Current page template
    page: {
      css: ko.observable("page"),
      template: ko.observable('intro')
    },
    
    //Each page has an object with all of its logic
    pages: {
      intro: {
        //The WebSocket function changes create to createReady
        create: ko.observable(function(){
          ;;console.log("WebSocket connection not set up yet!");
        }),
        createReady(){
          Opinionated.model.modal.template("create-room");
          Opinionated.model.modal.css("modal modal-small");
          ;;console.log("Setting focus to true");
          Opinionated.model.ui.toggleModal();
          Opinionated.model.modals.createRoom.focus(true);
        },
        
        //The WebSocket function changes join to joinReady
        join: ko.observable(function(){
          ;;console.log("WebSocket connection not set up yet!");
        }),
        joinReady(){
          ;;console.log("JoinReady");
          Opinionated.model.modal.template("join-room");
          Opinionated.model.modal.css("modal");
          Opinionated.model.ui.toggleModal();
          Opinionated.model.modals.joinRoom.getRooms()();
        }
      },
      main: {
        //The WebSocket function changes newRound to newRoundReady
        newRound: ko.observable(function(){
          ;;console.log("WebSocket connection not set up yet!");
        }),
        newRoundReady(){
          var msg = {
            name: "newRound",
            data: {
              id: Opinionated.model.room.id()
            }
          }
          msg = JSON.stringify(msg);
          Opinionated.ws.send(msg);
        },
        
        //The WebSocket function changes prime to primeReady
        prime: ko.observable(function(){
          
        }),
        primeReady(e){
          Opinionated.model.ui.primeLock(e);
          var msg = {
            name: "scoreChange",
            data: {
              score: e.number,
              status: "primed"
            }
          }
          msg = JSON.stringify(msg);
          Opinionated.ws.send(msg);
        },
        
        //The WebSocket function changes submit to submitReady
        submit: ko.observable(function(){
          ;;console.log("WebSocket connection not set up yet!");
        }),
        submitReady(e){
          Opinionated.model.ui.lockScore(e);
          var msg = {
            name: "scoreChange",
            data: {
              score: e.number,
              status: "submitted"
            }
          }
          msg = JSON.stringify(msg);
          Opinionated.ws.send(msg);
        }
      }
    },
        
    //Players in the game
    players: ko.observableArray(),
    
    //Whether the player has primed or locked in an answer or is ready
    playerStatus: ko.observable("ready"),
    
    //UI functions
    ui: {
      //hide is used added as a function to hide components when an animation is finished,
      // like on an animationend event
      hide(me, e){
        e.target.style.display = "none";
      },
      hidePage(){
        Opinionated.model.page.css("page slide-out");
      },
      isModalVisible: ko.observable(false),
      //Lock the player's score and disable the other buttons
      lockScore(e) {
        for(var i of Opinionated.model.availableScores()){
          i.lock('disabled');
        }
        e.lock('locked');
      },
      //When the user clicks outside of the modal, it hides the modal
      modalClickOff() {
        this.ui.toggleModal();
      },
      nav: {
        settings: {
          newName: ko.observable(),
          showSettings(){
            Opinionated.model.modal.template("settings");
            Opinionated.model.modal.css("modal");
            Opinionated.model.ui.toggleModal();
          },
          updateName: ko.observable(function(){
          ;;console.log("NO WS");
          }),
          updateNameReady(){
            localStorage.setItem("name", Opinionated.model.ui.nav.settings.newName());
            var msg = {
              name: "updateName",
              data: {
                name: Opinionated.model.ui.nav.settings.newName()
              }
            }
            msg = JSON.stringify(msg);
            Opinionated.ws.send(msg);
            Opinionated.model.ui.nav.settings.newName("");
            Opinionated.model.ui.toggleModal();
          }
        }
      },
      //Prime the player's score and clear any previous primed scores
      primeLock(e) {
        for(let i of Opinionated.model.availableScores()){
          i.lock('notLocked');
        }
        e.lock('lockReady');
        Opinionated.model.playerStatus("primed");
        if(Opinionated.model.showHint().indexOf("disabled") === -1){
          Opinionated.model.showHint("lock-hint disabled");
        }
      },
      toggleModal() {
        Opinionated.model.ui.isModalVisible(!Opinionated.model.ui.isModalVisible());
      }
    },

    //Room the player is currently in
    room: ko.mapping.fromJS({
      id: ko.observable(),
      name: ko.observable(),
      //Status at any point should be 'ready', 'inProgress' or 'over'
      status: ko.observable()
    }),
    
    //List of room objects, each with a name and an id
    rooms: ko.observableArray(),
    
    //Text to show based on room status
    roomStatusText: ko.pureComputed(function(){
      switch(Opinionated.model.room.status()){
        case "ready":
          return "Ready";
        case "inProgress":
          return "In Progress";
        case "over":
          return "Round Over";
      }
    }),
    
    showHint: ko.observable("hint")
  },
  
  //init starts the application
  init() {
    var ws = new WebSocket(`ws://${window.location.host}`);
    //Set up WebSocket event handlers
    (function wsEvents(model) {
      /*  
          Set up after open
          Changes functions to their functionReady counterparts
      */
      ws.onopen = function (e) {
        ;;console.log("WebSocket connected");
        
        //Makes ws accessible everywhere
        Opinionated.ws = ws;
        
        //Functions that send WS messages will only work after the WebSocket is opened
        //This sets all WebSocket dependent functions to their Ready variant
        Opinionated.readyify(Opinionated.model);
      }

      /*  
          Parse incoming messages
          All incoming messages will be JSON
          The name property describes the type of message
          The data property contains the payload 
      */
      ws.onmessage = function (msg) {
        msg = JSON.parse(msg.data);
        ;;console.log(msg);
        
        if(typeof Opinionated.wsMsg[msg.name] === 'function'){
          Opinionated.wsMsg[msg.name](msg, model);
        }
        else{
          Opinionated.wsMsg.errorInvalidName(msg);
        }
        
      }
    }(Opinionated.model));

    //Apply bindings
    ko.applyBindings(this.model);
  },
  
  //makes sure localStorage has a name for the player
  checkName() {
    if (!localStorage.getItem("name")) {
      ;;let name = prompt("Enter your name");
      localStorage.setItem("name", name);
      return name;
    }
    else{
      return localStorage.getItem("name");
    }
  },
  
  wsMsg: {
    /* If new potential scores are added */
    scoresUpdate(msg, m){
      localStorage.setItem("scores", msg.data.join(","));
      m.scores(msg.data);
    },

    /* When another player's status updates */
    playerScoreUpdate(msg, m){
      for (let i of m.players) {
        if (i.id === msg.data.id) {
          i.score(msh.data.score);
        }
      }
    },

    /* When another player joins */
    playersUpdate(msg, m){
      let add = true;
      for (let i of m.players()){
        if (i.id === msg.data.player.id){
          add = false;
        }
      }
      if (add){
        m.players.push(ko.mapping.fromJS(msg.data.player, Opinionated.createPlayerMapping));
      }
    },

    /* When the rooms list is sent */
    roomsListUpdate(msg, m){
      m.rooms(msg.data.rooms);
    },

    /* Sever's response to an attempt to join a room */
    updateRoom(msg, m){
      if(msg.data.status === "success"){
        console.log(msg.data.room);
        //Map the data from the server to the model
        ko.mapping.fromJS(msg.data.room, m.room);
        m.ui.hidePage();
        m.ui.toggleModal();
      }
    },

    /* When the server sends all the players on initial join */
    allPlayersUpdate(msg, m){
      //Map the data from the server to the model
      for(let i of msg.data.players){
        m.players.push(ko.mapping.fromJS(i, Opinionated.createPlayerMapping));
      }
    },

    /* When a player quits the room */
    playerQuit(msg, m){
      //Build new list of players without quitter
      let newPlayerList = [];
      for(let i of m.players()){
        if(i.id() !== msg.data.id){
          newPlayerList.push(ko.toJS(i));
        }
      }
      m.players.removeAll();
      for(let i of newPlayerList){
        m.players.push(ko.mapping.fromJS(i, Opinionated.createPlayerMapping));
      }
    },
    
    /* When a player's status updates (ready, primed, locked)*/
    playerStatusUpdate(msg, m){
      for(let i of m.players()){
        if(i.id() === msg.data.id){
          i.status(msg.data.status);
        }
      }
    },
    
    /* When the server sends all the scores at the end of a round */
    allScores(msg, m){
      for(let i of msg.data.scores){
        for(let j of m.players()){
          if(j.id() === i.id){
            j.score(i.score);
          }
        }
      }
    },
    
    /* When the server sends an update on the round status*/
    roundUpdate(msg, m){
      m.room.status(msg.data.status);
      if(msg.data.status === 'ready'){
        Opinionated.roundReset();
      }
      
    },
    
    /* When the server sends an invalid message*/
    errorInvalidName(msg, m){
      console.log(`Invalid name '${msg.name}' from server`);
    },
    
    /* When another player changes their name */
    nameUpdate(msg, m){
      for(let i of m.players()){
        if(i.id() === msg.data.id){
          i.name(msg.data.name);
        }
      }
    }
  },
  
  /*  Functions that depend on the WebSocket connection have two states;
      the function name and the function name + "Ready". 
      The WebSocket onopen event sets all the functions to their Ready variants */
  readyify(o){
    for(let i in o){
      if(o.hasOwnProperty(i)){
        if(typeof o[i] === 'object'){
          //Run recursively to get the whole model tree
          Opinionated.readyify(o[i]);
        }
        //All the readyifiable functions are Knockout observables 
        // so the change is captured and the UI doesn't use the old functions
        if(typeof o[i] === 'function' && ko.isObservable(o[i]) && typeof o[i + "Ready"] === 'function'){
          o[i](o[i + "Ready"]);
        }
      }
    }
  },
  
  /* Clears the player's score selection and clears the scoreboard */
  roundReset(){
    //Reset the scores and statuses
      for(let i of Opinionated.model.players()){
        i.score(null);
        i.status('ready');
      }
    //Reset the score selection
      for(let i of Opinionated.model.availableScores()){
        i.lock('notLocked');
      }
    },
  
  //Maping that creates scoreOrStatus observable on each player
  createPlayerMapping: {
    create(options){
      var model = ko.mapping.fromJS(options.data)
      model.scoreOrStatus = ko.computed(function(){
        if(typeof model.score() === 'number'){
          return model.score()
        }
        if(model.status() === 'primed'){
          return '<i class="material-icons">lock_open</i>';
        }
        if(model.status() === 'submitted'){
          return '<i class="material-icons">lock_outline</i>';
        }

      });
      return model;
    }
  }
}

/* ######### */
/* # Start # */
/* ######### */
Opinionated.init();