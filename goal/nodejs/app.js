
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
        {'name':'default',
        'players': [],
        'id':0,
        'settings': {
            'victory_points': 3,
            'lose_points': 0,
            'draw_points': 1, //strategy pattern return fn
        },
        matchs : []
        }
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

// should be improved, this server is not a static file server
app.get('/leaderboard/:name',function(req,res) {
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
        "name": "_",
        "singles_last_movement": 0, //data[key].singles_last_movement,
        "singles_lost": 0, //data[key].singles_lost,
        "singles_points": 0,
        "singles_won": 0, //data[key].singles_won,
        "status": true //data[key].status
    },
];

app.get('/connect/:lb?/:pseudo?', function(req,res) {
    const crypto = require('crypto');
    const secret = 'testscerert';
    const pseudo = req.params.pseudo ? req.params.pseudo : '';
    const lbname = req.params.lb ? req.params.lb : 'default';
    const hash = crypto.createHmac('sha256', secret)
        .update(pseudo+lbname) // add time
        .digest('hex');

    var lb = db.get('leaderboards')
        .find({'id':hash}).value();
    //create leaderboard if not found



    if (!lb) {
        var default_settings =
        {
            'victory_points': 3,
            'lose_points': 0,
            'draw_points': 1, //strategy pattern return fn
        };

        //create it
        var lb = db.get('leaderboards')
        .push({
        'id':hash,
        'players':[],
        'name':lbname,
        'owner':pseudo,
        'settings':default_settings,
        'matchs': []
        })
        .write();
    }

    res.json({'id':hash});
});

app.get('/info/:lb',function(req,res){
      var lbname = req.params.lb ? req.params.lb : 'default';
      var lb = db.get('leaderboards')
      .find({'id':lbname}).value();

    if (!lb) {
        res.json({})
    }

    res.json({
        'pseudo': lb.owner,
        'name': lb.name
    })
});

app.get('/players/:lb?',function(req,res) {
    if (store_data) {
      var lbname = req.params.lb ? req.params.lb : 'default';

      var lb = db.get('leaderboards')
      .find({'id':lbname}).value();
        if (!lb) {
            res.json({})
            return;
        }
        /*
      if (!lb) {
        //create it
        var lb = db.get('leaderboards')
        .push({'id':req.params.lb, 'players':[]})
        .write();
      }
        */
      const players = db.get('leaderboards')
      .find({'id':lbname})
      .get('players')
      .value();
      res.json(players);
    } else {
      res.json(players);
    }
});


app.get('/settings/points/:win/:draw/:lose/:lb?',function(req,res){
      var lbname = req.params.lb ? req.params.lb : 'default';
      var win_points = req.params.win;
      var lose_points = req.params.lose;
      var draw_points = req.params.draw;


        const settings = db.get('leaderboards')
        .find({'id':lbname})
        .get('settings')
        .assign({
            'victory_points': win_points,
            'lose_points': lose_points,
            'draw_points': draw_points
        })
        .value();

        res.json({});
});

app.get('/players/add/:name/:lb?',function(req,res) {
    if (store_data) {
      var lbname = req.params.lb ? req.params.lb : 'default';
        db.get('leaderboards')
        .find({'id':lbname})
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
    console.log('ok');
    res.json({'code':200});
}});



function add_score(lb, player_name, val) {
    var lbname = lb;

    //get player
    var player =  db.get('leaderboards')
    .find({'id':lbname})
    .get('players')
    .find({'name':player_name})
    .value();
    var singles_points = parseInt(player.singles_points) + parseInt(val);
    var points = parseInt(player.points) + parseInt(val);

    //update
    db.get('leaderboards')
    .find({'id':lbname})
    .get('players')
    .find({'name':player_name})
    .assign({
      singles_points   : singles_points,
      points : points
    })
    .value();
}

app.get('/matchs/:p1/:lb?', function(req,res){
        var lbname = req.params.lb ? req.params.lb : 'default';
        var p1 = req.params.p1;

        //get match
        var matchs = db.get('leaderboards')
        .find({'id':lbname})
        .get('matchs')
        .filter(
            m => m.p1 == p1 || m.p2 == p1
        )
        .value();

        if (!Array.isArray(matchs))
            matchs = [matchs];
        res.json(matchs);
});

app.get('/matchs/add/:p1/:p2/:score1/:score2/:lb?',function(req,res){

        var lbname = req.params.lb ? req.params.lb : 'default';
        var score_p1 = parseInt(req.params.score1);
        var score_p2 = parseInt(req.params.score2);
        var p1 = req.params.p1;
        var p2 = req.params.p2;

        // guard
        if (!p1 || !p2) {
            res.json({});
            return;
        }

        var match = {
            'p1': p1,
            'p2': p2,
            'score_p1' : score_p1,
            'score_p2' : score_p2,
            'status': ''
        };

        //get settings
        const settings = db.get('leaderboards')
        .find({'id':lbname})
        .get('settings')
        .value();

        console.log(settings);

        var lb = lbname;

        // TODO use compare fn

        // update score players
        if (score_p1 == score_p2) {
        // draw
            match.status = 'DRAW';
            // update Player 1
            add_score(lb, p1, settings.draw_points);
            add_score(lb, p2, settings.draw_points);
        }

        if (score_p2 > score_p1) {
            // p2 won
            match.status = 'P2';

            add_score(lb, p2, settings.victory_points);
            add_score(lb, p1, settings.lose_points);
        }

        if (score_p1 > score_p2) {
            //p1 won
            match.status = 'P1'

            add_score(lb, p2, settings.lose_points);
            add_score(lb, p1, settings.victory_points);
        }

        match.timestamp = Date.now();

        // add match history
        db.get('leaderboards')
        .find({'id':lbname})
        .get('matchs')
        .push(match)
        .value();

        res.json({});
        });

app.get('/players/setscore/:name/:score/:lb?',function(req,res) {

  if (store_data) {
    var lbname = req.params.lb ? req.params.lb : 'default';

    db.get('leaderboards')
    .find({'id':lbname})
    .get('players')
    .find({'name':req.params.name})
    .assign({
      singles_points   : parseInt(req.params.score),
      points : parseInt(req.params.score)
    })
    .value();

  } else {
    players.forEach(function(player) {
      if (player.name == req.params.name) {
        player.singles_points = parseInt(req.params.score);
        player.points = parseInt(req.params.score);
      }
    });
  }
  res.json({'code':200});

});



app.get('/players/addscore/:name/:score/:lb?',function(req,res) {
  if (store_data) {
    var lbname = req.params.lb ? req.params.lb : 'default';

    var player =  db.get('leaderboards')
    .find({'id':lbname})
    .get('players')
    .find({'name':req.params.name})
    .value();
    var singles_points = parseInt(player.singles_points) + parseInt(req.params.score);
    var points = parseInt(player.points) + parseInt(req.params.score);

    //update
    db.get('leaderboards')
    .find({'id':lbname})
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
