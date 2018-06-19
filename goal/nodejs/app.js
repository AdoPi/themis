
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

app.use(express.static('public'));

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const store_data = true;

// Set some defaults (required if your JSON file is empty)
db.defaults({ leaderboards: [
  {'name':'default', 'players': []}
]})
  .write()

//
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
app.get('/players/:lb?',function(req,res) {
    if (store_data) {
      var lbname = req.params.lb ? req.params.lb : 'default';
        const players = db.get('leaderboards')
        .find({'name':lbname})
        .get('players')
        .value();
        res.json(players);
    } else {
        res.json(players);
    }
});

app.get('/players/add/:name/:lb?',function(req,res) {
    if (store_data) {
      var lbname = req.params.lb ? req.params.lb : 'default';
        db.get('leaderboards')
        .find({'name':lbname})
        .get('players')
        .push({
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
            })
        .write();
} else {
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
}});

app.get('/players/addscore/:name/:score/:lb?',function(req,res) {
  if (store_data) {
    var lbname = req.params.lb ? req.params.lb : 'default';

    var player =  db.get('leaderboards')
    .find({'name':lbname})
    .get('players')
    .find({'name':req.params.name})
    .value();
    var singles_points = parseInt(player.singles_points) + parseInt(req.params.score);
    var points = parseInt(player.points) + parseInt(req.params.score);

    //        const player = db.get('players')
    //           .find({name: req.params.name})
    //          .value();

    //update
    db.get('leaderboards')
    .find({'name':lbname})
    .get('players')
    .find({'name':req.params.name})
    .assign({
      singles_points   : singles_points,
      points : points
    })
    .value();
  } else {
    players.forEach(function(player) {
      if (player.name == req.params.name) {
        player.singles_points = parseInt(player.singles_points) + parseInt(req.params.score);
        player.points = parseInt(player.points) + parseInt(req.params.score);
      }
    });
  }

  res.json({'code':200});
});

app.get('/players/remove/:id',function(req,res) {
});



server.listen(3000, function(){
});
