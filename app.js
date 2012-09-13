
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socketIO = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app);

var io = socketIO.listen(server);
var player1 = null;
var player2 = null;

io.sockets.on('connection', function(socket) {
  if(!player1) {
    player1 = socket;
    socket.emit('game-pending', {message: "You are the first player to join. Please wait for Player 2."});
  } else if(!player2) {
    player2 = socket;
    player1.emit('game-start', {role:"army"});
    player2.emit('game-start', {role:"bomber"});
  } else {
    throw new Error("There are too many players right now!");
  }

  // When a player sends an event saying it is done (e.g., after the user has selected
  // 5 checkboxes), save the coords the user sent.
  socket.on('player-done', function(data) {
    if(socket === player1 || socket === player2) {
      socket.coords = data.coords;
    }

    // Compare the two player's coords to see if Player 2 got any points.
    if(player1.coords && player2.coords) {
      var hits = [];
      player2.coords.forEach(function(item) {
        var hit = player1.coords.indexOf(item) !== -1;
        if(hit) {
          hits.push(item);
        }
      });
      // Send an event telling the clients the game is over and which coords were hits.
      io.sockets.emit('game-over', {hits: hits});
    }

    console.log("player-done coords:", data);
  });
});



server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
