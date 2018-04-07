
/*************************************************************************************************
REQUIRES
*************************************************************************************************/

var liri = require('../../allcombined.js');


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
        res.send(JSON.stringify({meta: {msg:"Thanks!", status:200}}));
    } else {
      res.send({meta: {msg:"Bad Query!", status: 400}})
    }
  });

  //return tokens and classification
  app.get('/parse', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (req.query.s) {
	var myobj = {};
        console.log(req.query)
        liri.main(req.query.s, response => {
	if (response != 'err') {
          res.send(JSON.stringify(response));
        } else {
        res.send({meta: {msg:"No results.", status: 200}})
	}
        })
  } else {
    res.send({meta: {msg:"Bad Query!", status: 400}})
  }
});
};
