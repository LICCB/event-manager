const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
  extended: true
}));
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
  res.render('event/createEvent', {
    title: "Create Event",
    users: await db.queryAllUsers()
  });
})

/**
 * Redirects to the events page after inserting the new event into the database and creating its participant table
 */
app.post('/createEvent', async (req, res) => {
  await db.insertEvent(req.body);
  res.redirect('/events');
});

/**
 * Renders the events page with the list of all events
 */
app.get('/events', async (req, res) => {
  res.render('event/events', {
    title: "Events",
    events: await db.queryAllEvents()
  });
})

/**
 * Renders the editEvent page with the properties of the given event
 */
app.get('/editEvent/:id', async (req, res) => {
  res.render("event/editEvent", {
    title: "Edit Event",
    event: (await db.queryEventByID(req.params.id))[0],
    users: await db.queryAllUsers(),
    utils: utils
  });
});

/**
 * Redirects to the events page after updating the event in the database
 */
app.post('/editEvent/:id', async (req, res) => {
  console.log(req.body);
  await db.updateEvent(req.body, req.params.id);
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
 * Redirects to the export page where the user can export event or participant data
 */
app.get('/export', async (req, res) => {
  res.render("export/export", {
    title: "Export",
    download: req.body.download,
  });
});

/**
 * Redirects back to export page after starting a download for the information requested
 */
app.post('/export/exportData', async (req, res) => {
  download = {};
  download.fileName = `${req.body.fileName}.${req.body.fileType}`;
  toExport = req.body.toExport;
  if (toExport == 'exportParticipants') {
    participants = await db.queryAllParticipants();
    delete participants.meta;
    console.log(participants);
    download.fileData = participants;
  }
  if (toExport == 'exportEvents') {
    events = await db.queryAllEvents();
    delete events.meta;
    console.log(events);
    download.fileData = events;
  }
  // Find a way to pass the fileData through to javascript for download
  console.log(download);

  res.render("export/export", {
    title: "Export",
    download: download
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})