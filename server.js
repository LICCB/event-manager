const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
const app = express();

const fs = require('fs');
const { Parser } = require('json2csv');

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
 * Redirects to the export page where the user can export participant data based on certain attributes
 */
app.get('/export', async (req, res) => {
  res.render("export/export", {
    title: "Export",
  });
});

/**
 * Export participants from a certain list of eventId's
 * EventId lists would be built later on based on certain attributes
 * For now, only one ID is received explicitly from the form
 */
app.post('/export/exportData', async (req, res) => {
  let fileName = `${req.body.fileName}.${req.body.fileType}`;

  // Will eventually be an additional database query to get a list of eventIDs from a certain attribute
  let eventID = req.body.eventID;
  participants = await db.queryParticipantsByEventID(eventID);
  delete participants.meta;

  // Grabs the names of all the columns from database table for use in creating the csv file header
  let cols = await db.queryAllCols('participants');
  delete cols.meta;
  let fields = [];
  for (let i = 0; i < cols.length; i++) {
    fields.push(cols[i]['COLUMN_NAME'])
  }
  // Converts participants list into csv file using json2csv module: https://www.npmjs.com/package/json2csv
  const csvParser = new Parser({fields});
  const csv = csvParser.parse(participants);
  
  // Create file in temporary directory for download
  fs.appendFile(`./tmpDir/${fileName}`, csv, function(err) {
    if (err) {
      console.log(`Error creating file --- ${err}`);
    }
  });
  res.download(`./tmpDir/${fileName}`, `${fileName}`);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})