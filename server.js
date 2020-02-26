const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set('view engine', 'ejs');

/**
 * Renders the home page
 */
app.get('/', function (req, res) {
    res.render('index');
})

/**
 * Renders the createEvent page with the list of possible event managers
 */
app.get('/createEvent', async (req, res) => {
  res.render('event/createEvent', {title: "Create Event", users: await db.queryAllUsers()});
})

/**
 * Redirects to the events page after inserting the new event into the database and creating its participant table
 */
app.post('/createEvent', async (req, res) => {
  await db.createEventTable(await db.insertEvent(req.body));
  res.redirect('/events');
});

/**
 * Renders the events page with the list of all events
 */
app.get('/events', async (req, res) => {
  res.render('event/events', {title: "Events", events: await db.queryAllEvents()});
})

/**
 * Renders the editEvent page with the properties of the given event
 */
app.get('/editEvent/:id', async (req, res) => {
  res.render("event/editEvent", {title: "Edit Event",event: (await db.queryEventByID(req.params.id))[0], users: await db.queryAllUsers(), utils: utils});
});

/**
 * Redirects to the events page after updating the event in the database
 */
app.post('/editEvent/:id', function (req, res) {
  db.updateEvent(req.body, req.params.id);
  res.redirect('/events');
})

/**
 * Redirects to the events page after deleting a given event
 */
app.get('/deleteEvent/:id', async (req, res) => {
  await db.deleteEvent(req.params.id);
  res.redirect('/events');
})

/**
 * Redirects to the lottery run selection pages
 */
app.get('/lottery/', async (req, res) => {
  res.render('event/lotteryLanding', {title:"Lottery Landing Page", events: (await db.queryAllEvents())});
});
// app.post('/lottery', function (req, res) {
//   res.render(`/lottery/${req.body.runSelection}`, {participants: await db.runSelectionDefault(req.body.runSelection), event: (await db.queryEventByID(req.body.runSelection))[0]})
// });
app.get('/lottery/:id', async (req, res) => {
  res.render('event/lottery', {participants: await db.runSelectionDefault(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});
app.get('/lottery/:id/REGSTATUS', async (req, res) => {
  res.render('event/lottery', {participants: await db.runSelectionREGSTATUS(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});
app.get('/lottery/:id/ISADULT', async (req, res) => {
  res.render('event/lottery', {participants: await db.runSelectionISADULT(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});
app.get('/lottery/:id/CANSWIM', async (req, res) => {
  res.render('event/lottery', {participants: await db.runSelectionCANSWIM(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});
app.get('/lottery/:id/HASCPRCERT', async (req, res) => {
  res.render('event/lottery', {participants: await db.runSelectionHASCPRCERT(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});
app.get('/lottery/:id/VOLUNTEER', async (req, res) => {
  res.render('event/lottery', {participants: await db.runSelectionVOLUNTEER(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})