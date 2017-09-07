// server.js
const fs             = require('fs');
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
//const natural        = require('natural');
const https          = require('https');
const http           = require('http');
const cors           = require('cors');
const app            = express();


const port = 8000;

var options = {
  key: fs.readFileSync('/home/torrencj/client-key.pem'),
  cert: fs.readFileSync('/home/torrencj/client-cert.pem')
};

//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


// routes/index.js
const parseRoutes = require('./app/routes')(app,{});

https.createServer(options, app).listen(8000);
//http.createServer(app).listen(80);

//app.listen(port, () => {
//  console.log('We are live on ' + port);
//});
