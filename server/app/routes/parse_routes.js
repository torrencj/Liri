
/*************************************************************************************************
REQUIRES
*************************************************************************************************/

// var natural = require('natural');
// var path = require('path');
// var omdb = require('./liri_omdb.js')
// var twitter = require('./liri_twitter.js')
// var spotify = require('./liri_spotify.js')
// var google = require('./liri_google.js')
var liri = require('../../allcombined.js');
// )
// var tokenizer = new natural.WordTokenizer();
// var TfIdf = natural.TfIdf;
// var tfidf = new TfIdf();



//returns tokens and classification.
module.exports = function(app, db) {
  app.post('/parse', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Origin", "localhost", "https://torrencj.github.io");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (req.query.s && req.query.c) {
        console.log(req.query)
        liri.liriCatTrain(req.query.s, req.query.c);
        // trainLiri(req.query.s, req.query.c)
        res.send(JSON.stringify({meta: {msg:"Thanks!", status:200}}));
    } else {
      res.send({meta: {msg:"Bad Query!", status: 400}})
    }
  });

  //return tokens and classification
  app.get('/parse', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
//    res.header("Access-Control-Allow-Origin", "localhost",  "https://torrencj.github.io");
  res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (req.query.s) {
	var myobj = {};
        console.log(req.query)
        liri.runLiri(req.query.s, response => {
          myobj.classification = response[0];
          myobj.searchString = response[1];
          res.send(JSON.stringify(myobj));
        })
  } else {
    res.send({meta: {msg:"Bad Query!", status: 400}})
  }
});
};
