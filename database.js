const config = require('./config.json');
const mariadb = require('mariadb');
const utils = require('./utils');
const pool = mariadb.createPool({
  host: config.database.host, 
  user: config.database.user,
  password: config.database.password,
  connectionLimit: 10,
  connectTimeout: 100000
});

const uuidv4 = require('uuid/v4');

async function queryAllUsers() {
  let conn = await pool.getConnection();
  let users = await conn.query("SELECT * FROM LICCB.users");
  conn.release();
  return users;
}

async function queryAllEvents() {
  let conn = await pool.getConnection();
  let events = await conn.query("SELECT * FROM LICCB.events");
  conn.release();
  return events;
};

async function queryEventByID(eventID) {
  let conn = await pool.getConnection();
  let event = await conn.query("SELECT * FROM LICCB.events WHERE eventID='" + eventID + "'")
  conn.release();
  return event;
}

async function queryParticipants() {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants");
  conn.release();
  return participants;
}

async function queryParticipantsByEventID(eventID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants WHERE eventID = '" + eventID + "'");
  conn.release();
  return participants;
}

async function queryParticipantsByEventAndParty(eventID, partyID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants WHERE eventID = '" + eventID + "' AND partyID = '" + partyID + "'");
  conn.release();
  return participants;
}

async function checkinParticipant(participantID, eventID) {
  let conn = await pool.getConnection();
  let participant = await conn.query("UPDATE LICCB.participants " +
                                     "SET checkinStatus = 'Checked In' " +
                                     "WHERE LICCB.participants.participantID = '" + participantID + "' " +
                                           "AND LICCB.participants.eventID = '" + eventID + "'");
  conn.release();
  return participant;
}

async function deleteEvent(id) {
  let conn = await pool.getConnection();
  let del = await conn.query("DELETE FROM LICCB.events WHERE eventID='" + id + "'");
  conn.release();
  return del;
};

async function insertEvent(event) {
  const eventMetadata = utils.getEventMetadata(event);
  const eventID = uuidv4();
  const insertStmt = "INSERT INTO LICCB.events " +
                    "(eventID, managerID, creatorID, eventName, " +
                    "maxPartySize, privateEvent, startTime, " + 
                    "endTime, eventStatus, capacity, staffRatio, eventDesc, eventNotes, eventMetadata) " + 
                "VALUES(" +
                    "'" + eventID + "', " + 
                    "'" + event.managerID + "', " +
                    "'" + event.managerID + "', " + // in place of creatorID               
                    "'" + event.eventName + "', " + 
                    event.maxPartySize + ", " + 
                    event.privateEvent + ", " +
                    "'" + event.startDate + " " + event.startTime + ":00', " +  
                    "'" + event.endDate + " " + event.endTime + ":00', " +
                    "'Unpublished', " +
                    event.capacity + ", " +
                    event.staffRatio + ", " + 
                    "'" + event.eventDesc + "', " +
                    "'" + event.eventNotes + "', " +
                    "'" + eventMetadata + "');";
  let conn = await pool.getConnection();
  let insert = await conn.query(insertStmt);
  conn.release();
  return eventID;
}

async function archiveEvent(id) {
  let conn = await pool.getConnection();
  const archive = "UPDATE LICCB.events " + 
                  "SET " +
                    "eventStatus='Archived'" +              
                  "WHERE eventID='" + id + "';"
  let arc = await conn.query(archive);
  conn.release();
  return arc;
}

async function cancelEvent(id) {
  let conn = await pool.getConnection();
  const cancel = "UPDATE LICCB.events " + 
                  "SET " +
                    "eventStatus='Cancelled'" +              
                  "WHERE eventID='" + id + "';"
  let canc = await conn.query(cancel);
  conn.release();
  return canc;
}

async function publishEvent(id) {
  let conn = await pool.getConnection();
  const publish = "UPDATE LICCB.events " + 
                  "SET " +
                    "eventStatus='Registration Open'" +              
                  "WHERE eventID='" + id + "';"
  let pub = await conn.query(publish);
  conn.release();
  return pub;
}

async function updateEvent(event, id) {
  const eventMetadata = utils.getEventMetadata(event);
  const update = "UPDATE LICCB.events " + 
                "SET " +
                  "managerID='" + event.managerID + "', " + 
                  "creatorID='" + event.managerID + "', " + 
                  "eventName='" + event.eventName + "', " + 
                  "maxPartySize=" + event.maxPartySize + ", " + 
                  "privateEvent=" + event.privateEvent + ", " +
                  "startTime='" + event.startDate + " " + event.startTime + ":00', " +  
                  "endTime='" + event.endDate + " " + event.endTime + ":00', " +
                  "capacity=" + event.capacity + ", " +
                  "staffRatio=" + event.staffRatio + ", " + 
                  "eventDesc='" + event.eventDesc + "', " +
                  "eventNotes='" + event.eventNotes + "', " +
                  "eventMetadata='" + eventMetadata + "' " +                  
                "WHERE eventID='" + id + "';"
  let conn = await pool.getConnection();
  let upd = await conn.query(update);
  conn.release();
  return upd;
}

async function insertParty(signup) {
  console.log(signup);
  const date = utils.getDateTime();
  const signupkeys = Object.keys(signup).length;
  var partsize = 0;
  if(signupkeys > 15) {
    partsize = (signupkeys - 15) / 10;
  };
  const registrantID = uuidv4();
  console.log(registrantID);
  const insertStmt = "INSERT INTO LICCB.participants " +
    "(participantID, partyID, eventID, firstName, " +
    "lastName, phone, email, emergencyPhone, emergencyName, zip, " +
    "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
    "eventDisc, regComments, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
    "VALUES(" +
    "'" + registrantID + "', " + //participantID
    "'" + registrantID + "', " + //partyID
    "'" + signup.eventID + "', " + //eventID
    "'" + signup.regfirstname + "', " + //firstName
    "'" + signup.reglastname + "', " + //lastName
    "'" + signup.regphone + "', " + //phone
    "'" + signup.regemail + "', " + //email
    "'" + signup.regephone + "', " + //emergencyPhone
    "'" + signup.regename + "', " + //emergencyName
    "'" + signup.zipcode + "', " + //zipcode
    signup.regadult + ", " + //isAdult
    signup.regcpr + ", " + //CPR
    signup.regswim + ", " + //swim
    signup.regboat + ", " + //boat
    "'" + signup.bhdiscovery + "', " + //boathouse discovery
    "'" + signup.eventdiscovery + "', " + //event discvoery
    "'" + signup.notes + "', " + //regComments
    "'Awaiting Confirmation', " + //regStatus
    "'Pending', " + //checkinStatus
    "0, " + //volunteer
    "'" + date + "', " + //regTime
    "'', " + //userComments
    "'');"; //metadata
  let conn = await pool.getConnection();
  let insert = await conn.query(insertStmt);
  

  for(i = 1; i < partsize + 1; i++) {
    var newParticipantID = uuidv4();
    var insertStmt1 = "INSERT INTO LICCB.participants " +
      "(participantID, partyID, eventID, firstName, " +
      "lastName, phone, email, emergencyPhone, emergencyName, zip, " +
      "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
      "eventDisc, regComments, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
      "VALUES(" +
      "'" + newParticipantID + "', " + //participantID
      "'" + registrantID + "', " + //partyID
      "'" + signup.eventID + "', " + //eventID
      "'" + signup[`part${i}fname`] + "', " + //firstName
      "'" + signup[`part${i}lname`]+ "', " + //lastName
      "'" + signup[`part${i}phone`] + "', " + //phone
      "'" + signup[`part${i}email`] + "', " + //email
      "'" + signup[`part${i}ephone`] + "', " + //emergencyPhone
      "'" + signup[`part${i}ename`] + "', " + //emergencyName
      "'" + signup.zipcode + "', " + //zipcode
      signup[`part${i}age`] + ", " + //isAdult
      signup[`part${i}cpr`] + ", " + //CPR
      signup[`part${i}swim`] + ", " + //swim
      signup[`part${i}boat`] + ", " + //boat
      "'" + signup.bhdiscovery + "', " + //boathouse discovery
      "'" + signup.eventdiscovery + "', " + //event discvoery
      "'" + signup.notes + "', " + //regComments
      "'Awaiting Confirmation', " + //regStatus
      "'Pending', " + //checkinStatus
      "0, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "'');"; //metadata
    let insert = await conn.query(insertStmt1);
  };
  conn.release();
  return registrantID;
};

async function updateParty(signup, eventID, partyID) {
  console.log(signup);
  const date = utils.getDateTime();
  const signupkeys = Object.keys(signup).length;
  var partsize = 0;
  if(signupkeys > 15) {
    partsize = (signupkeys - 15) / 10;
  };
  const update = "UPDATE LICCB.participants " +
    "SET " +
    "eventID='" + signup.eventID + "', " + //eventID
    "firstName='" + signup.regfirstname + "', " + //firstName
    "lastName='" + signup.reglastname + "', " + //lastName
    "phone='" + signup.regphone + "', " + //phone
    "email='" + signup.regemail + "', " + //email
    "emergencyPhone='" + signup.regephone + "', " + //emergencyPhone
    "emergencyName='" + signup.regename + "', " + //emergencyName
    "zip='" + signup.zipcode + "', " + //zip
    "isAdult=" + signup.regadult + ", " + //isAdult
    "hasCPRCert=" + signup.regcpr + ", " + //hasCPRCert
    "canSwim=" + signup.regswim + ", " + //canSwim
    "boatExperience=" + signup.regboat + ", " + //boatExperience
    "boathouseDisc='" + signup.bhdiscovery + "', " + //boathouse discovery
    "eventDisc='" + signup.eventdiscovery + "', " + //event discvoery
    "regComments='" + signup.notes + "' " + //regComments
    "WHERE eventID='" + eventID + "' AND partyID='" + partyID + "' AND participantID='" + partyID + "';";
  let conn = await pool.getConnection();
  const partsquery = await conn.query("SELECT participantID FROM LICCB.participants WHERE eventID = '" + eventID + "' AND partyID = '" + partyID + "'");
  var participants = partsquery.slice(0,partsquery.length);
  //const participants = query.slice(0, query.length-1)
  let insert = await conn.query(update);

  for(i = 1; i < partsize + 1; i++) {
    var newParticipantID = uuidv4();
    console.log(participants[i].participantID);
    var updateStmt = "IF EXISTS (SELECT * FROM LICCB.participants " + 
      "WHERE eventID='" + eventID + "' AND partyID='" + partyID + "' AND participantID='" + participants[i].participantID + "') " + 
      "UPDATE LICCB.participants SET (" +
      "eventID='" + signup.eventID + "', " + //eventID
      "firstName='" + signup[`part${i}fname`] + "', " + //firstName
      "lastName='" + signup[`part${i}lname`]+ "', " + //lastName
      "phone='" + signup[`part${i}phone`] + "', " + //phone
      "email='" + signup[`part${i}email`] + "', " + //email
      "emergencyPhone='" + signup[`part${i}ephone`] + "', " + //emergencyPhone
      "emergencyName='" + signup[`part${i}ename`] + "', " + //emergencyName
      "zip='" + signup.zipcode + "', " + //zipcode
      "isAdult=" + signup[`part${i}age`] + ", " + //isAdult
      "hasCPRCert=" + signup[`part${i}cpr`] + ", " + //CPR
      "canSwim=" + signup[`part${i}swim`] + ", " + //swim
      "boatExperience=" + signup[`part${i}boat`] + ", " + //boat
      "boathouseDisc='" + signup.bhdiscovery + "', " + //boathouse discovery
      "eventDisc='" + signup.eventdiscovery + "', " + //event discvoery
      "regComments='" + signup.notes + "') " + //regComments
      "WHERE eventID='" + eventID + "' AND partyID='" + partyID + "' AND participantID='" + participants[i].participantID + "' " +
      "ELSE " + 
      "INSERT INTO LICCB.participants VALUES(" +
      "'" + newParticipantID + "', " + //participantID
      "'" + partyID + "', " + //partyID
      "'" + signup.eventID + "', " + //eventID
      "'" + signup[`part${i}fname`] + "', " + //firstName
      "'" + signup[`part${i}lname`]+ "', " + //lastName
      "'" + signup[`part${i}phone`] + "', " + //phone
      "'" + signup[`part${i}email`] + "', " + //email
      "'" + signup[`part${i}ephone`] + "', " + //emergencyPhone
      "'" + signup[`part${i}ename`] + "', " + //emergencyName
      "'" + signup.zipcode + "', " + //zipcode
      signup[`part${i}age`] + ", " + //isAdult
      signup[`part${i}cpr`] + ", " + //CPR
      signup[`part${i}swim`] + ", " + //swim
      signup[`part${i}boat`] + ", " + //boat
      "'" + signup.bhdiscovery + "', " + //boathouse discovery
      "'" + signup.eventdiscovery + "', " + //event discvoery
      "'" + signup.notes + "', " + //regComments
      "'Awaiting Confirmation', " + //regStatus
      "'Pending', " + //checkinStatus
      "0, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "'');"; //metadata
    let insert = await conn.query(updateStmt);
  };
  conn.release();
  return registrantID;
};

async function insertVolunteerParty(signup) {
  console.log(signup);
  const date = utils.getDateTime();
  const signupkeys = Object.keys(signup).length;
  var partsize = 0;
  if(signupkeys > 15) {
    partsize = (signupkeys - 15) / 10;
  };
  const registrantID = uuidv4();
  const insertStmt = "INSERT INTO LICCB.participants " +
    "(participantID, partyID, eventID, firstName, " +
    "lastName, phone, email, emergencyPhone, emergencyName, zip, " +
    "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
    "eventDisc, regComments, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
    "VALUES(" +
    "'" + registrantID + "', " + //participantID
    "'" + registrantID + "', " + //partyID
    "'" + signup.eventID + "', " + //eventID
    "'" + signup.regfirstname + "', " + //firstName
    "'" + signup.reglastname + "', " + //lastName
    "'" + signup.regphone + "', " + //phone
    "'" + signup.regemail + "', " + //email
    "'" + signup.regephone + "', " + //emergencyPhone
    "'" + signup.regename + "', " + //emergencyName
    "'" + signup.zipcode + "', " + //zipcode
    signup.regadult + ", " + //isAdult
    signup.regcpr + ", " + //CPR
    signup.regswim + ", " + //swim
    signup.regboat + ", " + //boat
    "'" + signup.bhdiscovery + "', " + //boathouse discovery
    "'" + signup.eventdiscovery + "', " + //event discvoery
    "'" + signup.notes + "', " + //regComments
    "'Awaiting Confirmation', " + //regStatus
    "'Pending', " + //checkinStatus
    "1, " + //volunteer
    "'" + date + "', " + //regTime
    "'', " + //userComments
    "'');"; //metadata
  let conn = await pool.getConnection();
  let insert = await conn.query(insertStmt);
  conn.release();

  for(i = 1; i < partsize + 1; i++) {
    var participantID = uuidv4();
    var update1 = "INSERT INTO LICCB.participants " +
      "(participantID, partyID, eventID, firstName, " +
      "lastName, phone, email, emergencyPhone, emergencyName, zip, " +
      "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
      "eventDisc, regComments, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
      "VALUES(" +
      "'" + participantID + "', " + //participantID
      "'" + registrantID + "', " + //partyID
      "'" + signup.eventID + "', " + //eventID
      "'" + signup[`part${i}fname`] + "', " + //firstName
      "'" + signup[`part${i}lname`]+ "', " + //lastName
      "'" + signup[`part${i}phone`] + "', " + //phone
      "'" + signup[`part${i}email`] + "', " + //email
      "'" + signup[`part${i}ephone`] + "', " + //emergencyPhone
      "'" + signup[`part${i}ename`] + "', " + //emergencyName
      "'" + signup.zipcode + "', " + //zipcode
      signup[`part${i}age`] + ", " + //isAdult
      signup[`part${i}cpr`] + ", " + //CPR
      signup[`part${i}swim`] + ", " + //swim
      signup[`part${i}boat`] + ", " + //boat
      "'" + signup.bhdiscovery + "', " + //boathouse discovery
      "'" + signup.eventdiscovery + "', " + //event discvoery
      "'" + signup.notes + "', " + //regComments
      "'Awaiting Confirmation', " + //regStatus
      "'Pending', " + //checkinStatus
      "1, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "'');"; //metadata
    let conn = await pool.getConnection();
    let insert = await conn.query(insertStmt1);
    conn.release();
  };
  return registrantID;
};

module.exports.queryAllUsers = queryAllUsers;
module.exports.queryAllEvents = queryAllEvents;
module.exports.queryEventByID = queryEventByID;
module.exports.queryParticipants = queryParticipants;
module.exports.queryParticipantsByEventID = queryParticipantsByEventID;
module.exports.checkinParticipant = checkinParticipant;
module.exports.insertEvent = insertEvent;
module.exports.updateEvent = updateEvent;
module.exports.archiveEvent = archiveEvent;
module.exports.cancelEvent = cancelEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.publishEvent = publishEvent;
module.exports.insertParty = insertParty;
module.exports.insertVolunteerParty = insertVolunteerParty;
module.exports.queryParticipantsByEventAndParty = queryParticipantsByEventAndParty;
module.exports.updateParty = updateParty;