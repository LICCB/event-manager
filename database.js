const config = require('./config.json');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: config.database.host, 
  user: config.database.user, 
  password: config.database.password,
  connectionLimit: 5,
  connectTimeout: 10000
});

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
    console.log(event);
    console.log(event.eventname);
    // let conn;
    // try {
    //   conn = await pool.getConnection();
    //   const rows = await conn.query("INSERT");
    //   console.log(rows);
  
    // } catch (err) {
    //   throw err;
    // } finally {
    //   if (conn) return conn.end();
    // }
  }

module.exports.queryAllUsers = queryAllUsers;
module.exports.queryAllEvents = queryAllEvents;
module.exports.queryEventByID = queryEventByID;
module.exports.insertEvent = insertEvent;
queryEventByID("123e4567-e89b-12d3-a456-556642440000");