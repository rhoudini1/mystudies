const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use('/', bodyParser.urlencoded({extended:false}));

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Exercise schema
const { Schema } = mongoose;

// User schema
const userSchema = new Schema({
  username: {type: String, required: true},
  exercises: [{}]
});

// Models
const User = mongoose.model('User', userSchema);

// ROUTES
// User creation
app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  const user = new User({
    username: username,
    exercises: []
  });
  try {
    await user.save();
    res.json({
      username: user.username,
      _id: user._id
    });
  } catch (err) {
    console.log(err);
  }
});

// Retrieve all users
app.get('/api/users', async (req, res) => {
  const query = await User.find({}).select('-exercises').exec();
  res.json(query);
});

// EXERCISES
// create exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  const userId = req.params._id ? req.params._id : req.body._id;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = req.body.date
  ? new Date(req.body.date).toDateString()
  : new Date().toDateString();
  const user = await User.findOne({_id: userId});

  try {
    await User.updateOne(
      {_id: userId},
      {$push: {
        exercises: [{
          description: description,
          duration: duration,
          date: date
        }]}
      }
    );
  } catch (err) {
    console.log(err);
  }

  res.json({
    username: user.username,
    description: description,
    duration: duration,
    date: date,
    _id: userId
  })
});

// Retrieve full exercise log of any user
app.get('/api/users/:id/logs', async (req, res) => {
  const userId = req.params.id;
  const from = req.query.from;
  const to = req.query.to;
  const limit = Number(req.query.limit);
  const user = await User.findOne({_id: userId});

  let filteredArray = user.exercises;
  if(from) {
    filteredArray = filteredArray.filter(exercise => {
      return new Date(exercise.date) >= new Date(from)
    });
  }
  if(to) {
    filteredArray = filteredArray.filter(exercise => {
      return new Date(exercise.date) <= new Date(to)
    });
  }

  res.json({
    username: user.username,
    count: user.exercises.length,
    _id: user._id,
    log: limit
      ? filteredArray.slice(0, limit)
      : filteredArray
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
