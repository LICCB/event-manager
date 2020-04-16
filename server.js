const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
const mailer = require('./email');
const app = express();
const fs = require('fs');
const { Parser } = require('json2csv');
const authRoutes = require('./routes/auth-routes');
const settingsRoutes = require('./routes/settings-routes');
const passportSetup = require('./passport-setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const config = require('./config.json');
const logger = require('./logger');
const rbacSetup = require('./rbac-setup');
const AccessControl = require('accesscontrol');
var ac = "";
logger.module = 'server';

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.set('view engine', 'ejs');

// cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [config.keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// initialize rbac
async function setUpRBAC() {
  const holder = await rbacSetup.getRolesFromDb();
  ac = holder;
};
setUpRBAC();


// setup routes
app.use('/auth', authRoutes);
app.use('/settings', settingsRoutes);

const authCheck = (req, res, next) => {
  if(!req.user){
      // if not logged in
      res.redirect('/auth/google');
  } else {
      // if logged in
      next();
  }
};

/**
 * Renders the home page
 */
app.get('/', authCheck, function (req, res) {
  res.render('index', {
    user: req.user
  });
});

/**
 * Renders the createEvent page with the list of possible event managers
 */
app.get('/createEvent', authCheck, async (req, res) => {
  res.render('event/createEvent', {
    user: req.user,
    title: "Create Event",
    users: await db.queryAllUsers(),
    eventTypes: await db.queryEventTypes()
  });
});

/**
 * Redirects to the events page after inserting the new event into the database and creating its participant table
 */
app.post('/createEvent', authCheck, async (req, res) => {
  await db.insertEvent(req.body);
  res.redirect('/events');
});

/**
 * Renders the events page with the list of all events
 */
app.get('/events', authCheck, async (req, res) => {
  res.render('event/events', {
    user: req.user,
    title: "Events",
    events: utils.cleanupEventData(await db.queryEventsTableData())
  });
});

app.get('/event/:id', authCheck, async (req, res) => {
  const e = await db.queryEventDetailsByID(req.params.id);
  res.render('event/event', {
    user: req.user,
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
    event: (await db.queryEventByID(req.params.eventID))[0],
    eventType: (await db.queryEventTypeMetadata(req.params.eventID))[0],
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
app.get('/editEvent/:id', authCheck, async (req, res) => {
  res.render("event/editEvent", {
    user: req.user,
    title: "Edit Event",
    event: (await db.queryEventByID(req.params.id))[0],
    users: await db.queryAllUsers(),
    eventTypes: await db.queryEventTypes(),
    utils: utils
  });
});

/**
 * Redirects to the events page after updating the event in the database
 */
app.post('/editEvent/:id', authCheck, async (req, res) => {
  const {oldStart, oldEnd, newStart, newEnd} = await db.updateEvent(req.body, req.params.id);
  if((oldStart.getTime() !== newStart.getTime()) || (oldEnd.getTime() !== newEnd.getTime())){
    const emails = await db.queryRegistrantEmailsByEventID(req.params.id);
    mailer.sendTimeChangeEmail(emails, oldStart, oldEnd, newStart, newEnd, req.body.eventName);
  }
  res.redirect('/events');
});

/**
 * Redirects to the events page after deleting a given event
 */
app.get('/deleteEvent/:id', authCheck, async (req, res) => {
  await db.deleteEvent(req.params.id);
  res.redirect('/events');
});

/**
 * Redirects to the events page after archiving a given event
 */
app.get('/archiveEvent/:id', authCheck, async (req, res) => {
  await db.archiveEvent(req.params.id);
  res.redirect('/events');
});

/**
* Redirects to the events page after publishing a given event
*/
app.get('/publishEvent/:id', authCheck, async (req, res) => {
 await db.publishEvent(req.params.id);
 res.redirect('/events');
});

/**
 * Redirects to the events page after cancelling a given event
 */
app.get('/cancelEvent/:id', authCheck, async (req, res) => {
  await db.cancelEvent(req.params.id);
  res.redirect('/events');
});

/**
 * Renders the complete participant list
 */
app.get('/participants', authCheck, async (req, res) => {
  res.render('participants/allParticipants', {
    user: req.user,
    participants: await db.queryParticipants()
  });
});

/**
 * Renders the participant list for the specified event
 */
app.get('/participants/:id', authCheck, async (req, res) => {
  res.render('participants/eventParticipants', {
    user: req.user,
    participants: await db.queryParticipantsByEventID(req.params.id),
    event: (await db.queryEventByID(req.params.id))[0]
  });
});

/**
 * Renders the participant list for the specified participant
 */
app.get('/participant/:id', authCheck, async (req, res) => {
  res.render('participants/singleParticipant', {
    user: req.user,
    participants: await db.queryParticipantByID(req.params.id),
    event: (await db.queryEventByID(req.params.id))[0]
  });
});

/**
 * Renders the participant list to tie with the selected participant
 */
app.get('/participants/tie/:id', authCheck, async (req, res) => {
  res.render('participants/tieParticipants', {selected: (await db.queryParticipantByID(req.params.id))[0], participants: await db.queryParticipantsByNotID(req.params.id)})
});

/**
 * Ties two participants together and renders the all participants view with a success alert
 */
app.get('/participants/tie/:id/:idwith', authCheck, async (req, res) => {
  await db.tieParticipants(req.params.id, req.params.idwith);
  res.redirect('/participants');
});

/**
 * Updates the userCommets for the participant
 */
app.post('/participant/comment/:eventID/:participantID', authCheck, async (req, res) => {
  await db.editUserComments(req.params.participantID, req.params.eventID, req.body.comment)
  res.redirect('/participants/' + req.params.eventID)
});

/**
 * Renders the participant check in list for the specified event
 */
app.get('/participants/checkin/:id', authCheck, async (req, res) => {
  res.render('participants/checkinParticipants', {participants: await db.queryParticipantsByEventID(req.params.id), event: (await db.queryEventByID(req.params.id))[0]})
});

/**
 * Checks in a participant and redirects back to the event's check in table
 */
app.get('/participants/checkin/:eventid/:participantid', authCheck, async (req, res) => { // Should be changed to POST
  await db.checkinParticipant(req.params.participantid, req.params.eventid);
  res.redirect('/participants/checkin/' + req.params.eventid);
});

app.get('/editRegistration/:eventid/:partyid', async (req, res) => {
  res.render("signup/editRegistration", {
    title: "Edit Public Signup",
    event: (await db.queryEventByID(req.params.eventid))[0],
    eventType: (await db.queryEventTypeMetadata(event.eventType))[0],
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
app.get('/export', authCheck, async (req, res) => {
  let events = await db.queryAllEvents();;
  delete events.meta;
  let users = await db.queryAllUsers();
  delete users.meta;
  res.render("export/export", {
    user: req.user,
    title: "Export",
    events: events,
    users: users,
    error: null
  });
});

/**
 * Export participants from a certain list of eventId's
 * EventId lists would be built later on based on certain attributes
 * For now, only one ID is received explicitly from the form
 */
app.post('/export/exportData', authCheck, async (req, res) => {
  let fileName = "ParticipantData.csv";
  if (req.body.fileName != '') {
    fileName = `${req.body.fileName}.csv`;
  }
  // Event type attribute in events table is an ID linked to eventTypes table with a human-readable name for the type
  if (req.body.eventTypeCheck == 'on') {
    tmp = await db.queryEventTypeIDByName(req.body.eventTypeVal);
    delete tmp.meta;
    eventType = tmp.typeID;
  }
  let eventAttrs = {
    "eventName": req.body.eventNameCheck == 'on' ? req.body.eventNameVal : '',
    "eventStatus": req.body.eventStatusCheck == 'on' ? req.body.eventStatusVal : '',
    "eventType": req.body.eventTypeCheck == 'on' ? eventType : '',
    "managerID": req.body.managerNameCheck == 'on' ? req.body.managerNameVal : '',
    "creatorID": req.body.creatorNameCheck == 'on' ? req.body.creatorNameVal : '',
  };
  let participants = await db.queryParticipantsByEventAttr(eventAttrs);

  delete participants.meta;

  if (participants.length == 0) {
    let events = await db.queryAllEvents();
    delete events.meta;
    let users = await db.queryAllUsers();
    delete users.meta;
    res.render("export/export",  {
      user: req.user,
      title: "Export",
      events: events,
      users: users,
      error: "No participants were found."
    });
    return;
  }

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
  logger.log('Listening on port 3000!', 'info');
});