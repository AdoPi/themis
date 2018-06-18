
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static('public'));



//var config = require('./config')

/*
 * Express config
 */

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});



app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// players
var players = [
    {
        "doubles_last_movement": 0,//data[key].doubles_last_movement,
        "doubles_lost": 0, //data[key].doubles_lost,
        "doubles_points": 0, //data[key].doubles_points,
        "doubles_won": 0, //data[key].doubles_won,
        "dt": 0,
        "name": "Adonis",
        "singles_last_movement": 0, //data[key].singles_last_movement,
        "singles_lost": 0, //data[key].singles_lost,
        "singles_points": 0,
        "singles_won": 0, //data[key].singles_won,
        "status": true //data[key].status
    },
    {
        "doubles_last_movement": 0,//data[key].doubles_last_movement,
        "doubles_lost": 0, //data[key].doubles_lost,
        "doubles_points": 0, //data[key].doubles_points,
        "doubles_won": 0, //data[key].doubles_won,
        "dt": 0,
        "name": "Marine",
        "singles_last_movement": 0, //data[key].singles_last_movement,
        "singles_lost": 0, //data[key].singles_lost,
        "singles_points": 0,
        "singles_won": 0, //data[key].singles_won,
        "status": true //data[key].status
    }

];
app.get('/players',function(req,res) {
    res.json(players);
});

app.get('/players/add/:name',function(req,res) {
    console.log('adding')
    players.push({
        "doubles_last_movement": 0,//data[key].doubles_last_movement,
        "doubles_lost": 0, //data[key].doubles_lost,
        "doubles_points": 0, //data[key].doubles_points,
        "doubles_won": 0, //data[key].doubles_won,
        "dt": 0,
        "name": req.params.name,
        "singles_last_movement": 0, //data[key].singles_last_movement,
        "singles_lost": 0, //data[key].singles_lost,
        "singles_points": 0,
        "singles_won": 0, //data[key].singles_won,
        "status": true //data[key].status
    });
    res.json({'code':200});
});


app.post('/players/update/:name/', function(req,res) {
    players.forEach(function(player) {
        if (player.name == req.params.name) {
            player.score = req.params.score;
        }
    });
    res.json({'code':200});
});


app.get('/draw/:name/:name/:result',function(req,res) {
    players.forEach(function(player) {
        if (player.name == req.params.name) {
            player.score = req.params.score;
        }
    });
    res.json({'code':200});
});

app.get('/win/:name/:name/:result/:result',function(req,res) {
    console.log('add score'+score);
    players.forEach(function(player) {
        if (player.name == req.params.name) {
            player.score = req.params.score;
        }
    });
    res.json({'code':200});
});


app.get('/players/score/:name/:score',function(req,res) {
    players.forEach(function(player) {
        if (player.name == req.params.name) {
            player.score = req.params.score;
        }
    });
    res.json({'code':200});
});

app.get('/players/addscore/:name/:score',function(req,res) {
    players.forEach(function(player) {
        if (player.name == req.params.name) {
            console.log('updated' + req.params.score);
            player.singles_points = parseInt(player.singles_points) + parseInt(req.params.score);
            player.points = parseInt(player.points) + parseInt(req.params.score);
        }
    });
    res.json({'code':200});
});

app.get('/players/remove/:id',function(req,res) {
});



server.listen(3000, function(){
});
