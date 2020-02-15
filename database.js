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
  }

async function queryEventByID(eventID) {
  let conn = await pool.getConnection();
  let event = await conn.query("SELECT * FROM LICCB.events WHERE eventID='" + eventID + "'")
  conn.release();
  return event;
}

async function deleteEvent(id) {
  let conn = await pool.getConnection();
  let del = await conn.query("DELETE FROM LICCB.events WHERE eventID='" + id + "'");
  conn.release();
  return del;
}

async function insertEvent(event) {
  const eventMetadata = utils.getEventMetadata(event);
  console.log(event);
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

async function createEventTable(id){
  const createStmt = "CREATE TABLE LICCB.event" + id.replace(/-/g, "") + "(" + 
                      "participantID   char(36) NOT NULL PRIMARY KEY, " + 
                      "partyID         char(36) NOT NULL, " + 
                      "isAdult         BOOLEAN NOT NULL, " +
                      "canSwim         BOOLEAN NOT NULL, " +
                      "phone           VARCHAR(30) NOT NULL, " +
                      "email           VARCHAR(75) NOT NULL, " +
                      "emergencyPhone  VARCHAR(30) NOT NULL, " +
                      "emergencyName   VARCHAR(60) NOT NULL, " +
                      "hasCPRCert      BOOLEAN NOT NULL, " + 
                      "regStatus       ENUM('Registered', 'Not Selected', 'Standby', 'Selected', 'Checked In', 'No Show', 'Cancelled'), " + 
                      "volunteer       BOOLEAN DEFAULT 0, " + 
                      "FOREIGN KEY (`participantID`) " + 
                          "REFERENCES `history` (`participantID`), " +
                      "FOREIGN KEY (`partyID`) " + 
                          "REFERENCES `history` (`participantID`));";
  let conn = await pool.getConnection();
  let create = await conn.query(createStmt);
  conn.release();
  return create;
}

async function updateEvent(event, id) {
  const update = "UPDATE LICCB.events " + 
                "SET " +
                  "eventName='" + event.eventname + "', " + 
                  "manager='" + event.manager + "', " + 
                  "capacity=" + event.capacity + ", " +
                  "maxPartySize=" + event.maxpartysize + ", " + 
                  "privateEvent=" + event.participationtype + ", " +
                  "startTime='" + event.startdate + " " + event.starttime + ":00', " +  
                  "endTime='" + event.enddate + " " + event.endtime + ":00', " +
                  "staffRatio=" + event.staffratio + ", " + 
                  "creatorID='1b671a64-40d5-491e-99b0-da01ff1f3341', " +
                  "eventNotes='" + event.notes + "' " +
                "WHERE eventID='" + id + "';"
  let conn = await pool.getConnection();
  let upd = await conn.query(update);
  conn.release();
  return upd;
}

module.exports.queryAllUsers = queryAllUsers;
module.exports.queryAllEvents = queryAllEvents;
module.exports.queryEventByID = queryEventByID;
module.exports.insertEvent = insertEvent;
module.exports.updateEvent = updateEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.createEventTable = createEventTable;