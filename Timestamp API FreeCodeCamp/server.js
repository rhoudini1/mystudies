// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/:input?", (req, res) => {
  let timestamp, date, response;
  const input = req.params.input;

  if(input == null) {
    date = new Date();
    timestamp = date.getTime();
    response = {unix: timestamp, utc: date.toUTCString()};
  } else if(isNaN(+input) && isNaN(Date.parse(req.params.input))) {
    response = { error : "Invalid Date" }
  } else if(!isNaN(+input)) {
    timestamp = +input;
    date = new Date(timestamp).toUTCString();
    response = {unix: timestamp, utc: date};
  } else {
    date = new Date(input).toUTCString();
    timestamp = Math.floor(new Date(input).getTime());
    response = {unix: timestamp, utc: date};
  }

  res.json(response);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
