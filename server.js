const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/createEvent', function (req, res) {
  db.queryAllUsers()
  .then(users => {
    console.log(users);
    res.render('createEvent', {users: users});
  })
  .catch(err => {
    res.render('createEvent', {users: null});
  });
})

app.post('/createEvent', function (req, res) {
  // var event = Event(req.body);
  // console.log(event.name);
  db.insertEvent(req.body);
  res.render('events');
});

app.get('/events', async (req, res) => {
  db.queryAllEvents()
    .then(rows => {
      console.log(rows[0]);
      res.render('events', {events: rows});
    })
    .catch(err => {
      res.render('events', {events: null});
    })
})

app.get('/editEvent/:id', async (req, res) => {
  db.queryEventByID(req.params.id, res)
    .then(rows => {
      console.log(rows[0]);
      res.render("editEvent", {event: rows[0], utils: utils});
    })
    .catch(err => {
      console.log(err);
      res.render("editEvent", {event: null, utils: utils});
    });
})

app.post('/editEvent/:id', async (req, res) => {
  console.log(req.body);
  db.updateEvent(req.body);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})