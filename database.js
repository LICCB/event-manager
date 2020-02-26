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

async function queryAllCols(tableName) {
  let conn = await pool.getConnection();
  let cols = await conn.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${tableName}'`);
  conn.release();
  return cols;
}

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

async function queryEventsTableData(){
  let conn = await pool.getConnection();
  const query = "SELECT eventID, eventName, firstName, lastName, eventStatus, privateEvent, startTime, endTime " +
                "FROM (LICCB.events AS e) JOIN (LICCB.users AS u) on " +
                      "e.managerID=u.userID;"
  let events = await conn.query(query);
  conn.release();
  return events;
}

async function queryParticipantsByEventID(eventID) {
  let conn = await pool.getConnection();
  let participants = await conn.query(`SELECT * FROM LICCB.participants WHERE eventID='${eventID}'`)
  conn.release();
  return participants;
}

async function queryEventByID(eventID) {
  let conn = await pool.getConnection();
  let event = await conn.query("SELECT * FROM LICCB.events WHERE eventID='" + eventID + "'")
  conn.release();
  return event;
}
async function queryEventDetailsByID(eventID) {
  let conn = await pool.getConnection();
  const query = "SELECT * " + 
                `FROM (SELECT * FROM LICCB.events WHERE eventID='${eventID}') as E JOIN (SELECT * FROM LICCB.users) AS U on ` + 
                      `E.managerID=U.userID;`;
  let event = await conn.query(query)
  conn.release();
  return event;
}

async function queryParticipants() {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants JOIN LICCB.events ON LICCB.participants.eventID=LICCB.events.eventID");
  conn.release();
  return participants;
}

async function queryParticipantsByEventID(eventID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants WHERE eventID = '" + eventID + "'");
  conn.release();
  return participants;
}

async function queryParticipantByID(participantID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM " +
                                      "(SELECT * FROM LICCB.participants WHERE participantID = '" + participantID + "') AS p " +
                                      "JOIN LICCB.events ON p.eventID=LICCB.events.eventID");
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

async function editUserComments(participantID, eventID, comment) {
  let conn = await pool.getConnection();
  let participant = await conn.query("UPDATE LICCB.participants " +
                                     "SET userComments = '" + comment + "' " +
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
  const dateTimeQuery = "Select startTime, endTime " + 
                        "From LICCB.events " + 
                        `WHERE eventID='${id}';`;
  console.log(dateTimeQuery);
  const startTime = event.startDate + " " + event.startTime + ":00";
  const endTime = event.endDate + " " + event.endTime + ":00";
  const update = "UPDATE LICCB.events " + 
                "SET " +
                  "managerID='" + event.managerID + "', " + 
                  "creatorID='" + event.managerID + "', " + 
                  "eventName='" + event.eventName + "', " + 
                  "maxPartySize=" + event.maxPartySize + ", " + 
                  "privateEvent=" + event.privateEvent + ", " +
                  "startTime='" + startTime + "', " +  
                  "endTime='" + endTime + "', " +
                  "capacity=" + event.capacity + ", " +
                  "staffRatio=" + event.staffRatio + ", " + 
                  "eventDesc='" + event.eventDesc + "', " +
                  "eventNotes='" + event.eventNotes + "', " +
                  "eventMetadata='" + eventMetadata + "' " +                  
                "WHERE eventID='" + id + "';"
  let conn = await pool.getConnection();
  let oldDateTimes = await conn.query(dateTimeQuery);
  let upd = await conn.query(update);
  conn.release();
  return {
          oldStart : oldDateTimes[0].startTime,
          oldEnd : oldDateTimes[0].endTime,
          newStart : new Date(startTime),
          newEnd : new Date(endTime)
         };
}

async function confirmEmail(eventID, registrantID){
  const confirm = "UPDATE LICCB.participants " + 
                  "SET " +
                    "regStatus='Registered' " +                 
                  `WHERE eventID='${eventID}' AND partyID='${registrantID}';`;
  const query = "SELECT email, eventName " + 
                 "FROM " + 
                        `(SELECT * FROM LICCB.participants WHERE participantID='${registrantID}' AND eventID='${eventID}') AS p ` + 
                 "JOIN " + 
                        `(SELECT * FROM LICCB.events WHERE eventID='${eventID}') AS e on ` + 
                        "p.eventID = e.eventID;";
  let conn = await pool.getConnection();
  let update = await conn.query(confirm);
  let vals = await conn.query(query);
  conn.release();
  return vals[0];
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
  conn.release();

  for(i = 1; i < partsize + 1; i++) {
    var participantID = uuidv4();
    var insertStmt1 = "INSERT INTO LICCB.participants " +
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
      "0, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "'');"; //metadata
    let conn = await pool.getConnection();
    let insert = await conn.query(insertStmt1);
    conn.release();
  };
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
    var insertStmt1 = "INSERT INTO LICCB.participants " +
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
      "0, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "'');"; //metadata
    let conn = await pool.getConnection();
    let insert = await conn.query(insertStmt1);
    conn.release();
  };
  return registrantID;
};

async function queryRegistrantEmailsByEventID(eventID){
  const query = "SELECT email " + 
                "FROM LICCB.participants " +
                `WHERE eventID='${eventID}' and email !='';`; 
  let conn = await pool.getConnection();
  let emails = await conn.query(query);
  conn.release();
  return emails.map(function (x) {
    return Object.values(x);
    },
    emails.slice(0, emails.length - 1)).flat()
}

module.exports.queryAllUsers = queryAllUsers;
module.exports.queryEventsTableData = queryEventsTableData;
module.exports.queryAllEvents = queryAllEvents;
module.exports.queryEventByID = queryEventByID;
module.exports.queryEventDetailsByID = queryEventDetailsByID;
module.exports.queryParticipants = queryParticipants;
module.exports.queryParticipantByID = queryParticipantByID;
module.exports.queryParticipantsByEventID = queryParticipantsByEventID;
module.exports.checkinParticipant = checkinParticipant;
module.exports.editUserComments = editUserComments;
module.exports.insertEvent = insertEvent;
module.exports.updateEvent = updateEvent;
module.exports.queryAllCols = queryAllCols;
module.exports.archiveEvent = archiveEvent;
module.exports.cancelEvent = cancelEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.publishEvent = publishEvent;
module.exports.confirmEmail = confirmEmail;
module.exports.insertParty = insertParty;
module.exports.insertVolunteerParty = insertVolunteerParty;
module.exports.queryRegistrantEmailsByEventID = queryRegistrantEmailsByEventID;
