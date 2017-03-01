Opinionated
===========

Opinionated is a simple Web app to share data between users. I created it for our team to give difficulty scores to items in our sprint planning meetings.

Clients can create rooms that other clients can join. Data is sent between the server and clients with WebSocket connections.

Build and Run
-------------
1. Run `yarn`
2. Run `gulp`

gulp runs webpack to build the bundle and starts nodemon, which runs the server and will restart on changes.
