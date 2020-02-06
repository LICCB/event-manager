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
    console.log("ERROR:\n\t" + err);
    res.redirect('/createEvent');
  });
})

app.post('/createEvent', async (req, res) => {
  // console.log(req.body);
  // db.insertEvent(req.body)
  //   .then(success => {
  //     console.log("Created new event:\n\t" + req.body);
  //     res.redirect('/events')
  //   })
  //   .catch(err => {
  //     console.log("Failed To Create New Event:\t" + req.body.eventname);
  //     res.redirect('/events');
  //   })
  await db.insertEvent(req.body);
  res.redirect('/events');
});

app.get('/events', async (req, res) => {
  res.render('events', {events: await db.queryAllEvents()});
})

app.get('/editEvent/:id', async (req, res) => {
  // db.queryEventByID(req.params.id, res)
  //   .then(rows => {
  //     console.log(rows[0]);
  //     db.queryAllUsers()
  //     .then(users => {
  //       res.render("editEvent", {event: rows[0], users: users, utils: utils});
  //     })
  //     .catch(err =>{
  //       console.log("ERROR:\n\t\t" + err);
  //       res.render("editEvent", {event: rows[0], users: users, utils: utils});
  //     }); 
  //   })
  //   .catch(err => {
  //     console.log("ERROR:\n\t\t" + err);
  //     res.render("editEvent", {event: null, utils: utils});
  //   });
  // let event = await db.queryEventByID(req.params.id);
  // // console.log(event);
  // let users = await db.queryAllUsers();
  // // console.log(users);
  res.render("editEvent", {event: (await db.queryEventByID(req.params.id))[0], users: await db.queryAllUsers(), utils: utils});
});

app.get('/deleteEvent/:id', async (req, res) => {
  await db.deleteEvent(req.params.id);
  res.redirect('/events');
})

app.post('/editEvent/:id', function (req, res) {
  db.updateEvent(req.body, req.params.id);
  res.redirect('/events');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})