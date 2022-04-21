require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dns = require('dns');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use('/', bodyParser.urlencoded({extended:false}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// DATABASE
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

//Defining schema and model
const urlSchema = new mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type: Number, required: true}
});

const Url = mongoose.model('Url', urlSchema);

// ROUTES
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST REQUEST with url
app.post('/api/shorturl', async (req, res, next) => {
  let last = await Url.findOne()
    .sort('-_id')
    .lean()
    .exec();
  
  res.locals.last = last;
  next();
  
}, (req, res) => {
  //verify if is a valid URL
  const urlObj = new URL(req.body.url);
  dns.lookup(urlObj.hostname, (err, address, family) => {
    if(err) {
      res.json({ error: 'invalid url' });
    } else {
      const thisShort = res.locals.last["short_url"] + 1;

      const newUrl = new Url({
        original_url: req.body.url,
        short_url: thisShort
      });

      newUrl.save((err, data) => {
        if(err) return console.log(err);
      });

      res.json({
        original_url: newUrl["original_url"],
        short_url: newUrl["short_url"]
      })
    }
  });
});

// Retrieve stored URL
app.get('/api/shorturl/:num?', async (req, res, next) => {
  const num = req.params.num;
  if(!num || isNaN(Number(num))){
    res.json({error: 'Invalid URL or URL not provided'});
  }
  const short = Number(req.params.num);
  const search = await Url.findOne({ short_url: short }, (err, data) => {
    if(err) return console.log(err);
    return data;
  });
  res.locals.urlToRedirect = search ? search["original_url"] : null;
  next();
}, (req, res) => {
    if(!res.locals.urlToRedirect) {
      res.json({ error: "Short URL not found"});
    }
    res.redirect(res.locals.urlToRedirect);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
