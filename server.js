const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
const mailer = require('./email');
const app = express();

const fs = require('fs');
const { Parser } = require('json2csv');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.set('view engine', 'ejs');

/**
 * Renders the home page
 */
app.get('/', function (req, res) {
  res.render('index');
});

/**
 * Renders the createEvent page with the list of possible event managers
 */
app.get('/createEvent', async (req, res) => {
  res.render('event/createEvent', {
    title: "Create Event",
    users: await db.queryAllUsers()
  });
});

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
    events: utils.cleanupEventData(await db.queryEventsTableData())
  });
});

app.get('/event/:id', async (req, res) => {
  const e = await db.queryEventDetailsByID(req.params.id);
  console.log(e);
  console.log(e.startTime);
  res.render('event/event', {
    title: "Event Detail",
    event: e[0],
    participants: await db.queryParticipantsByEventID(req.params.id),
    utils: utils
  });
});

app.get('/signup', function (req, res) {
  res.render('signup/volunteer');
});

app.post('/signup', function (req, res) {
  if (req.body.volunteer == 'true') {
    res.redirect('signupEventList/1');
  } else {
    res.redirect('signupEventList/0');
  };
});

app.get('/signupEventList/:volunteerStatus', async (req, res) => {
  res.render('signup/signupEventList', {
    title: "List of Events",
    events: await db.querySpecificEvents(req.params.volunteerStatus),
    volunteerStatus: req.params.volunteerStatus
  });
});

app.get('/eventSignup/:eventID/:volunteerStatus', async (req, res) => {
  res.render('signup/eventSignup', {
    title: "Public Signup",
    eventID: req.params.eventID,
    volunteerStatus: req.params.volunteerStatus
  });
});

app.post('/eventSignup/:eventID/:volunteerStatus', async (req, res) => {
  await db.insertParty(req.body, req.params.eventID, req.params.volunteerStatus);
  res.redirect('/signup/signupThanks');
});
         
app.post('/signup', async (req, res) => {
  const regID = await db.insertVolunteerParty(req.body);
  const reg = req.body;
  mailer.sendConfirmationEmail(reg.regemail, reg.eventID, regID);
  res.redirect('/signup/signupThanks')
});

app.get('/signup/signupThanks', function(req, res) {
  res.render('signup/signupThanks')
});

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
  const {oldStart, oldEnd, newStart, newEnd} = await db.updateEvent(req.body, req.params.id);
  if((oldStart.getTime() !== newStart.getTime()) || (oldEnd.getTime() !== newEnd.getTime())){
    const emails = await db.queryRegistrantEmailsByEventID(req.params.id);
    console.log(emails);
    mailer.sendTimeChangeEmail(emails, oldStart, oldEnd, newStart, newEnd, req.body.eventName);
  }
  res.redirect('/events');
});

/**
 * Redirects to the events page after deleting a given event
 */
app.get('/deleteEvent/:id', async (req, res) => {
  await db.deleteEvent(req.params.id);
  res.redirect('/events');
});

/**
 * Redirects to the events page after archiving a given event
 */
app.get('/archiveEvent/:id', async (req, res) => {
  await db.archiveEvent(req.params.id);
  res.redirect('/events');
});

/**
* Redirects to the events page after publishing a given event
*/
app.get('/publishEvent/:id', async (req, res) => {
 await db.publishEvent(req.params.id);
 res.redirect('/events');
});

/**
 * Redirects to the events page after cancelling a given event
 */
app.get('/cancelEvent/:id', async (req, res) => {
  await db.cancelEvent(req.params.id);
  res.redirect('/events');
});

/**
 * Renders the complete participant list
 */
app.get('/participants', async (req, res) => {
  res.render('participants/allParticipants', {participants: await db.queryParticipants()})
});

/**
 * Renders the participant list for the specified event
 */
app.get('/participants/:id', async (req, res) => {
  res.render('participants/eventParticipants', {participants: await db.queryParticipantsByEventID(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});

/**
 * Renders the participant list for the specified participant
 */
app.get('/participant/:id', async (req, res) => {
  res.render('participants/singleParticipant', {participants: await db.queryParticipantByID(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});

/**
 * Updates the userCommets for the participant
 */
app.post('/participant/comment/:eventID/:participantID', async (req, res) => {
  await db.editUserComments(req.params.participantID, req.params.eventID, req.body.comment)
  res.redirect('/participants/' + req.params.eventID)
});

/**
 * Renders the participant check in list for the specified event
 */
app.get('/participants/checkin/:id', async (req, res) => {
  res.render('participants/checkinParticipants', {participants: await db.queryParticipantsByEventID(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});

/**
 * Checks in a participant and redirects back to the event's check in table
 */
app.get('/participants/checkin/:eventid/:participantid', async (req, res) => { // Should be changed to POST
  await db.checkinParticipant(req.params.participantid, req.params.eventid);
  res.redirect('/participants/checkin/' + req.params.eventid);
});

app.get('/editRegistration/:eventid/:partyid', async (req, res) => {
  res.render("signup/editRegistration", {
    title: "Edit Public Signup",
    events: await db.queryAllEvents(),
    event: (await db.queryEventByID(req.params.eventid))[0],
    participants: await db.queryParticipantsByEventAndParty(req.params.eventid, req.params.partyid),
    utils: utils
  });
});

app.post('/editRegistration/:eventid/:partyid', async (req, res) => {
  await db.updateParty(req.body, req.params.eventid, req.params.partyid);
  res.redirect('/signupThanks');
});
  
app.get('/confirmEmail/:eventID/:registrantID', async (req, res) => {
  const {email, eventName} = await db.confirmEmail(req.params.eventID, req.params.registrantID);
  mailer.sendEditRegistrationEmail(email, eventName, req.params.eventID, req.params.registrantID);
  res.render('email/confirmEmail', {title: "Email Confirmed"});
});

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
  let participants = await db.queryParticipantsByEventID(eventID);
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
  
  // Send file to the browser to start download
  res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});