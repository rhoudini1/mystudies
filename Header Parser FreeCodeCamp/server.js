// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// "who am I" endpoint 
app.get("/api/whoami", (req, res) => {
  const ip = req.ip;
  const lang = req.headers["accept-language"];
  const system = req.headers["user-agent"];
  
  res.json({
    ipaddress: ip,
    language: lang,
    software: system
  });
});

// listen for requests
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('App is listening on port ' + listener.address().port);
});
