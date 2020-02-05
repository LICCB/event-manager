const config = require('./config.json');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: config.database.host, 
  user: config.database.user, 
  password: config.database.password,
  connectionLimit: 5,
  connectTimeout: 10000
});

const uuidv4 = require('uuid/v4');

async function queryAllUsers() {
  let conn;
  try {
    conn = await pool.getConnection();
    return conn.query("SELECT * FROM LICCB.users");
  } catch (err) {
    throw err;
  }
}

async function queryAllEvents() {
    let conn;
    try {
      conn = await pool.getConnection();
      return conn.query("SELECT * FROM LICCB.events");
    } catch (err) {
      throw err;
    }
  }

async function queryEventByID(eventID, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    return conn.query("SELECT * FROM LICCB.events WHERE eventID='" + eventID + "'")
  } catch (err) {
    throw err;
  }
}

  async function insertEvent(event) {
    const query = "INSERT INTO LICCB.events (eventID, eventName, manager, capacity, " +
                  "maxPartySize, privateEvent, startTime, endTime, skillLevel, distance, " +
                  "staffRatio, creatorID, eventNotes) VALUES(" +
                  "'" + uuidv4() + "', " + 
                  "'" + event.eventname + "', " + 
                  "'" + event.manager + "', " + 
                  event.capacity + ", " +
                  event.maxpartysize + ", " + 
                  event.privateevent + ", " +
                  "'" + event.startdate + " " + event.starttime + ":00', " +  
                  "'" + event.enddate + " " + event.endtime + ":00', " +
                  "'" + event.skilllevel + "', " +
                  event.distance + ", " + 
                  event.staffratio + ", " + 
                  "'1b671a64-40d5-491e-99b0-da01ff1f3341', " +
                  "'" + event.notes + "');";
    console.log(query);
    let conn;
    try {
      conn = await pool.getConnection();
      conn.query(query)
        .then(good => {
          console.log("Successful Insertion:\n\t" + good);
        })
        .catch(err => {
          console.log("Insertion Failed:\n\t" + err);
        })
  
    } catch (err) {
      throw err;
    }
  }

module.exports.queryAllUsers = queryAllUsers;
module.exports.queryAllEvents = queryAllEvents;
module.exports.queryEventByID = queryEventByID;
module.exports.insertEvent = insertEvent;
queryEventByID("123e4567-e89b-12d3-a456-556642440000");