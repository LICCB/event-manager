const config = require('./config.json');
const mariadb = require('mariadb');
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
  const query = "INSERT INTO LICCB.events " +
                    "(eventID, eventName, manager, creatorID, " +
                    "capacity, maxPartySize, privateEvent, startTime, " + 
                    "endTime, staffRatio, published, eventNotes, eventMetadata) " + 
                "VALUES(" +
                    "'" + uuidv4() + "', " + 
                    "'" + event.eventname + "', " + 
                    "'" + event.manager + "', " +
                    "'1b671a64-40d5-491e-99b0-da01ff1f3341', " +
                    event.capacity + ", " +
                    event.maxpartysize + ", " + 
                    event.privateevent + ", " +
                    "'" + event.startdate + " " + event.starttime + ":00', " +  
                    "'" + event.enddate + " " + event.endtime + ":00', " +
                    event.staffratio + ", " + 
                    "1, " +
                    "'" + event.notes + "', " +
                    "NULL);";
  let conn = await pool.getConnection();
  let rows = await conn.query(query);
  conn.release();
  return rows;
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