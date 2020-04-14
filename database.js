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
}

async function queryEventsTableData(){
  let conn = await pool.getConnection();
  const query = "SELECT eventID, eventName, firstName, lastName, eventStatus, privateEvent, startTime, endTime " +
                "FROM (LICCB.events AS e) JOIN (LICCB.users AS u) on " +
                      "e.managerID=u.userID;";
  let events = await conn.query(query);
  conn.release();
  return events;
}

async function queryParticipantsByEventID(eventID) {
  let conn = await pool.getConnection();
  let participants = await conn.query(`SELECT * FROM LICCB.participants WHERE eventID='${eventID}'`);
  conn.release();
  return participants;
}

async function queryParticipantsByEventAttr(eventAttrs) {
  let conn = await pool.getConnection();
  let queryString = `SELECT * FROM LICCB.events as E, LICCB.participants as P WHERE `;

  // Add all selected attributes to query
  let attrKeys = Object.keys(eventAttrs);
  for (let i = 0; i < attrKeys.length; i++) {
    if (eventAttrs[attrKeys[i]] != '') {
      queryString += `E.${attrKeys[i]} = '${eventAttrs[attrKeys[i]]}' AND `
    }
  }
  // Join events table with participants table to get participant data
  queryString += "E.eventID = P.eventID"
  let participants = await conn.query(queryString);
  conn.release();
  return participants;
}

async function queryEventTypeIDByName(eventTypeName) {
  let conn = await pool.getConnection();
  let participants = await conn.query(`SELECT typeID FROM LICCB.eventTypes WHERE typeName='${eventTypeName}'`);
  conn.release();
  return participants;
}

async function queryEventByID(eventID) {
  let conn = await pool.getConnection();
  let event = await conn.query("SELECT * FROM LICCB.events WHERE eventID= ?", [eventID]);
  conn.release();
  return event;
}

async function queryEventDetailsByID(eventID) {
  let conn = await pool.getConnection();
  const query = "SELECT * " + 
                `FROM (SELECT * FROM LICCB.events WHERE eventID='${eventID}') as E JOIN (SELECT * FROM LICCB.users) AS U on E.managerID=U.userID ` +
                      `JOIN (SELECT * FROM LICCB.eventTypes) AS T on E.eventType=T.typeID;`
  let event = await conn.query(query);
  conn.release();
  return event;
}

async function queryEventTypeMetadata(eventID) {
  let conn = await pool.getConnection();
  const query = `SELECT typeMetadata FROM LICCB.eventTypes WHERE typeID= (SELECT eventType FROM LICCB.events WHERE eventID = '${eventID}')`;
  let metadata = await conn.query(query);
  conn.release();
  return metadata;
}

async function queryParticipants() {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants JOIN LICCB.events ON LICCB.participants.eventID=LICCB.events.eventID");
  conn.release();
  return participants;
}

async function queryParticipantsByEventID(eventID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants WHERE eventID = ?", [eventID]);
  conn.release();
  return participants;
}

async function queryParticipantsByEventAndParty(eventID, partyID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM LICCB.participants WHERE eventID = ? AND partyID = ? ORDER BY regTime", [eventID, partyID]);
  conn.release();
  return participants;
}

async function queryParticipantByID(participantID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM " +
                                      "(SELECT * FROM LICCB.participants WHERE participantID = ?) AS p " +
                                      "JOIN LICCB.events ON p.eventID=LICCB.events.eventID",
                                      [participantID]);
  conn.release();
  return participants;
}

/*
 * Select all participants that haven't participated in any event that the
 * given participant has participated in.
 */
async function queryParticipantsByNotID(participantID) {
  let conn = await pool.getConnection();
  let participants = await conn.query("SELECT * FROM " +
                                        "(SELECT * FROM LICCB.participants " +
                                        "WHERE NOT participantID = ? AND " +
                                          "participantID NOT IN (SELECT participantID FROM LICCB.participants " +
                                                                "WHERE eventID IN (SELECT eventID FROM LICCB.participants " +
                                                                                  "WHERE participantID = ?))) AS p " +
                                      "JOIN LICCB.events ON p.eventID=LICCB.events.eventID",
                                      [participantID, participantID]);
  conn.release();
  return participants;
}

async function tieParticipants(participantID, tieWithParticipantID) {
  let conn = await pool.getConnection();
  let result = await conn.query("UPDATE LICCB.participants " +
                                "SET partyID = ?" +
                                "WHERE LICCB.participants.partyID = ?",
                                [tieWithParticipantID, participantID]);
  result = await conn.query("UPDATE LICCB.participants " +
                            "SET participantID = ?" +
                            "WHERE LICCB.participants.participantID = ?",
                            [tieWithParticipantID, participantID]);
  conn.release();
  return result;
}

async function checkinParticipant(participantID, eventID) {
  let conn = await pool.getConnection();
  let participant = await conn.query("UPDATE LICCB.participants " +
                                     "SET checkinStatus = 'Checked In' " +
                                     "WHERE LICCB.participants.participantID = ? " +
                                           "AND LICCB.participants.eventID = ?",
                                     [participantID, eventID]);
  conn.release();
  return participant;
}

async function editUserComments(participantID, eventID, comment) {
  let conn = await pool.getConnection();
  let participant = await conn.query("UPDATE LICCB.participants " +
                                     "SET userComments = ? " +
                                     "WHERE LICCB.participants.participantID = ? " +
                                           "AND LICCB.participants.eventID = ?",
                                     [comment, participantID, eventID]);
  conn.release();
  return participant;
}

async function deleteEvent(id) {
  let conn = await pool.getConnection();
  let del = await conn.query("DELETE FROM LICCB.events WHERE eventID='" + id + "'");
  conn.release();
  return del;
}

async function insertEvent(event) {
  const eventMetadata = utils.getEventMetadata(event);
  const eventTypeMetadata = "";
  const eventID = uuidv4();
  const insertStmt = "INSERT INTO LICCB.events " +
                    "(eventID, managerID, creatorID, eventName, " +
                    "maxPartySize, privateEvent, startTime, " + 
                    "endTime, eventStatus, capacity, staffRatio, eventDesc, eventNotes, eventMetadata, eventType) " + 
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
                    "'" + eventMetadata + "'," + 
                    "'" + event.typeID + "');";
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
                  "WHERE eventID='" + id + "';";
  let arc = await conn.query(archive);
  conn.release();
  return arc;
}

async function cancelEvent(id) {
  let conn = await pool.getConnection();
  const cancel = "UPDATE LICCB.events " + 
                  "SET " +
                    "eventStatus='Cancelled'" +              
                  "WHERE eventID='" + id + "';";
  let canc = await conn.query(cancel);
  conn.release();
  return canc;
}

async function publishEvent(id) {
  let conn = await pool.getConnection();
  const publish = "UPDATE LICCB.events " + 
                  "SET " +
                    "eventStatus='Registration Open'" +              
                  "WHERE eventID='" + id + "';";
  let pub = await conn.query(publish);
  conn.release();
  return pub;
}

async function updateEvent(event, id) {
  const eventMetadata = utils.getEventMetadata(event);
  const eventTypeMetadata = "";
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
                  "eventMetadata='" + eventMetadata + "', " +                  
                  "eventType='" + event.typeID + "' " +                  
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

async function insertParty(signup, eventID, volunteerStatus) {
  console.log(signup);
  const date = utils.getDateTime();
  var signupkeys = Object.keys(signup).length;
  var partsize = 0;
  const event = (await queryEventByID(eventID))[0];
  var eventTypeFields = (await queryEventTypeMetadata(eventID))[0].typeMetadata;
  const metadataFields = Object.keys(JSON.parse(event.eventMetadata)).length + Object.keys(JSON.parse(eventTypeFields)).length;
  console.log("signupKeys:" + signupkeys);
  console.log("metadataFields:" + metadataFields);
  signupkeys = signupkeys - metadataFields;
  console.log("adjusted:" + signupkeys);
  if(volunteerStatus == 1) {
    signupkeys = signupkeys - 2;
  }
  console.log("final:" + signupkeys);
  if(signupkeys > 14) {
    partsize = (signupkeys - 14) / 10;
  }
  console.log("partysize:" + partsize);
  let conn = await pool.getConnection();
  const queryStmt = "SELECT participantID FROM LICCB.participants WHERE eventID != ? AND ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?)";
  const query = await conn.query(queryStmt, [eventID, signup.regfirstname, signup.reglastname, signup.regemail, signup.regphone]);
  var registrantID = uuidv4();
  console.log(query[0]);
  if(query[0] != undefined) {
    registrantID = query[0].participantID;
  }
  var eventSpecificMetadata = utils.eventMetadataWrapper(signup, event.eventMetadata);
  var eventTypeMetadata = utils.eventMetadataWrapper(signup, eventTypeFields);
  eventTypeFields = JSON.parse(eventSpecificMetadata);
  eventTypeFields = Object.assign({}, eventTypeFields);
  eventTypeMetadata = JSON.parse(eventTypeMetadata);
  eventTypeMetadata = Object.assign({}, eventTypeMetadata);
  metadata = Object.assign(eventTypeFields, eventTypeMetadata);
  var insertStmt = "INSERT INTO LICCB.participants " +
    "(participantID, partyID, eventID, firstName, " +
    "lastName, phone, email, emergencyPhone, emergencyName, zip, " +
    "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
    "eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
    "VALUES(" +
    "'" + registrantID + "', " + //participantID
    "'" + registrantID + "', " + //partyID
    "?, " + //eventID
    "?, " + //firstName
    "?, " + //lastName
    "?, " + //phone
    "?, " + //email
    "?, " + //emergencyPhone
    "?, " + //emergencyName
    "?, " + //zipcode
    signup.regadult + ", " + //isAdult
    signup.regcpr + ", " + //CPR
    signup.regswim + ", " + //swim
    signup.regswim + ", " +//boat
    "?, " + //boathouse discovery
    "?, " + //event discvoery
    "?, "; //regComments
    if(volunteerStatus == 1) {
      insertStmt += signup.priorVolunteer + ", " + //priorVolunteer
      signup.roleFamiliarity + ", ";//roleFamiliarity
    } else {
      insertStmt += "null, " + //priorVolunteer
      "null, ";//roleFamiliarity
    }
    insertStmt += "'Awaiting Confirmation', " + //regStatus
    "'Pending', " + //checkinStatus
    "?, " + //volunteer
    "'" + date + "', " + //regTime
    "'', " + //userComments
    "'?');"; //metadata
  console.log(registrantID);
  let insert = await conn.query(insertStmt, [eventID, signup.regfirstname, signup.reglastname, signup.regphone, signup.regemail, signup.regephone, signup.regename, signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, metadata]);

  for(i = 1; i <= partsize; i++) {
    const queryStmt = "SELECT participantID FROM LICCB.participants WHERE eventID != ? AND ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?)";
    const query = await conn.query(queryStmt, [eventID, signup.regfirstname, signup.reglastname, signup.regemail, signup.regphone]);
    var newParticipantID = uuidv4();
    if(query[0] != undefined) {
      newParticipantID = query[0].participantID;
    }
    var insertStmt1 = "INSERT INTO LICCB.participants " +
      "(participantID, partyID, eventID, firstName, " +
      "lastName, phone, email, emergencyPhone, emergencyName, zip, " +
      "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
      "eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
      "VALUES(" +
      "'" + newParticipantID + "', " + //participantID
      "'" + registrantID + "', " + //partyID
      "?, " + //eventID
      "?, " + //firstName
      "?, " + //lastName
      "?, " + //phone
      "?, " + //email
      "?, " + //emergencyPhone
      "?, " + //emergencyName
      "?, " + //zipcode
      signup[`part${i}age`] + ", " + //isAdult
      signup[`part${i}cpr`] + ", " + //CPR
      signup[`part${i}swim`] + ", " + //swim
      signup[`part${i}boat`] + ", " + //boat
      "?, " + //boathouse discovery
      "?, " + //event discvoery
      "?, "; //regComments
      if(volunteerStatus == 1) { //Add volunteer fields if they are a volunteer
        insertStmt1 += signup.priorVolunteer + ", " + //priorVolunteer
        signup.roleFamiliarity + ", ";//roleFamiliarity
      } else { //Make volunteer fields null if they are not
        insertStmt1 += "NULL, " + //priorVolunteer
        "NULL, ";//roleFamiliarity
      }
      insertStmt1 += "'Awaiting Confirmation', " + //regStatus
      "'Pending', " + //checkinStatus
      "?, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "'?');"; //metadata
    let insert = await conn.query(insertStmt1, [eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, metadata]);
  console.log(eventID);
  console.log(registrantID);
  conn.release();
  return registrantID;
  }
}

async function updateParty(signup, eventID, partyID) {
  console.log(signup);
  const date = utils.getDateTime();
  const signupkeys = Object.keys(signup).length;
  var partsize = 0;
  if(signupkeys > 16) {
    partsize = (signupkeys - 16) / 11;
  }
  console.log(partsize);
  const update = "UPDATE LICCB.participants " +
    "SET " +
    "eventID=?, " + //eventID
    "firstName=?, " + //firstName
    "lastName=?, " + //lastName
    "phone=?, " + //phone
    "email=?, " + //email
    "emergencyPhone=?, " + //emergencyPhone
    "emergencyName=?, " + //emergencyName
    "zip=?, " + //zip
    "isAdult=?, " + //isAdult
    "hasCPRCert=?, " + //hasCPRCert
    "canSwim=?, " + //canSwim
    "boatExperience=?, " + //boatExperience
    "boathouseDisc=?, " + //boathouse discovery
    "eventDisc=?, " + //event discvoery
    "regComments=? " + //regComments
    "WHERE eventID=? AND partyID=? AND participantID=?;";
  let conn = await pool.getConnection();
  let insert = await conn.query(update, [signup.eventID, signup.regfirstname, signup.reglastname, signup.regphone, signup.regemail, signup.regephone, signup.regename, signup.zipcode, signup.regadult, signup.regcpr, signup.regboat, signup.bhdiscovery, signup.eventdiscovery, signup.notes, eventID, partyID, partyID]);

  var partIds = signup.partIDs;
  for(i = 1; i <= partsize; i++) {
    var newParticipantID = uuidv4();
    console.log(signup[`part${i}ID`]);
    var updateStmt = "IF EXISTS (SELECT * FROM LICCB.participants " + 
      "WHERE eventID=? AND partyID=? AND participantID=? AND firstName = ? AND lastName = ?) " +
      "THEN UPDATE LICCB.participants SET " +
      "eventID=?, " + //eventID
      "firstName=?, " + //firstName
      "lastName=?, " + //lastName
      "phone=?, " + //phone
      "email=?, " + //email
      "emergencyPhone=?, " + //emergencyPhone
      "emergencyName=?, " + //emergencyName
      "zip=?, " + //zipcode
      "isAdult=?, " + //isAdult
      "hasCPRCert=?, " + //CPR
      "canSwim=?, " + //swim
      "boatExperience=?, " + //boat
      "boathouseDisc=?, " + //boathouse discovery
      "eventDisc=?, " + //event discvoery
      "regComments=? " + //regComments
      "WHERE eventID=? AND partyID=? AND participantID=?; " +
      "ELSE " + 
      "INSERT INTO LICCB.participants VALUES(" +
      "'" + newParticipantID + "', " + //participantID
      "?, " + //partyID
      "?, " + //eventID
      "?, " + //firstName
      "?, " + //lastName
      "?, " + //phone
      "?, " + //email
      "?, " + //emergencyPhone
      "?, " + //emergencyName
      "?, " + //zipcode
      "?, " + //isAdult
      "?, " + //CPR
      "?, " + //swim
      "?, " + //boat
      "?, " + //boathouse discovery
      "?, " + //event discvoery
      "?, " + //regComments
      "'Awaiting Confirmation', " + //regStatus
      "'Pending', " + //checkinStatus
      "0, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "''); END IF;"; //metadata
    let insert = await conn.query(updateStmt, [eventID, partyID, signup[`part${i}ID`], signup[`part${i}fname`], signup[`part${i}lname`], signup.eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup.zipcode, signup[`part${i}age`], signup[`part${i}cpr`], signup[`part${i}swim`], signup[`part${i}boat`], signup.bhdiscovery, signup.eventdiscovery, signup.notes, eventID, partyID, signup[`part${i}ID`], partyID, signup.eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup.zipcode, signup[`part${i}age`], signup[`part${i}cpr`], signup[`part${i}swim`], signup[`part${i}boat`], signup.bhdiscovery, signup.eventdiscovery, signup.notes]);
  }
  if(partsize < signup.partIDs.length) {
    //loop through participants who need to be deleted
    //CHECK IF THERE IS MORE THAN ONE ENTRY IF NOT DONT LOOP THROUGH DO partIds
    for(i = 0; i < signup.partIDs.length; i++) {
      console.log(partIds[i]);
      deleteStmt = "UPDATE LICCB.participants " +
      "SET " +
      "partyID='' " + 
      "WHERE eventID=? AND partyID=? AND participantID=?;";
    let insert = await conn.query(deleteStmt, [eventID, partyID, partIds[i]]);
    }
  }
  conn.release();
  return partyID;
}

async function querySpecificEvents(choice) {
  var query = "";
  if (choice == 1) {
    query = "SELECT * " +
                "FROM LICCB.events " +
                "WHERE eventStatus = 'Registration Open';";
  } else {
    query = "SELECT * " +
                "FROM LICCB.events " +
                "WHERE eventStatus = 'Registration Open' AND privateEvent = 0;";
  }
  
  let conn = await pool.getConnection();
  let events = await conn.query(query);
  conn.release();
  return events;
}

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
    emails.slice(0, emails.length - 1)).flat();
}

async function queryAllUsers(){
  const query = 'SELECT * FROM LICCB.users;';
  console.log(query);
  let conn = await pool.getConnection();
  let user = await conn.query(query);
  conn.release();
  return user;
}

async function queryUserByEmail(email){
  const query = `SELECT * FROM LICCB.users WHERE email='${email}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let user = await conn.query(query);
  conn.release();
  return user;
}

async function queryUserByID(userID){
  const query = `SELECT * FROM LICCB.users WHERE userID='${userID}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let user = await conn.query(query);
  conn.release();
  return user;
}

async function updateUser(email, googleID, fname, lname){
  const query = 'UPDATE LICCB.users ' +
                `SET googleID='${googleID}', firstName='${fname}', lastName='${lname}' ` +
                `WHERE email='${email}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let upd = await conn.query(query);
  conn.release();
  return upd;
}

async function insertUser(email, fName, lName){
  const userID = uuidv4();
  const query = 'INSERT INTO LICCB.users ' +
                '(userID, email, googleID, firstName, lastName, userEnabled) ' +
                `VALUES('${userID}', '${email}', '${userID}', '${fName}', '${lName}', 1)`; // set googleID to userID until first login
  console.log(query);
  let conn = await pool.getConnection();
  let insert = await conn.query(query);
  conn.release();
  return insert;
}

async function disableUser(id){
  const query = `UPDATE LICCB.users SET userEnabled=0 WHERE userID='${id}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let upd = await conn.query(query);
  conn.release();
  return upd;
}

async function enableUser(id){
  const query = `UPDATE LICCB.users SET userEnabled=1 WHERE userID='${id}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let upd = await conn.query(query);
  conn.release();
  return upd;
}

async function deleteUser(id){
  const query = `DELETE FROM LICCB.users WHERE userID='${id}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let del = await conn.query(query);
  conn.release();
  return del;
}

async function queryEventTypes(){
  let conn = await pool.getConnection();
  // const query = "SELECT * FROM LICCB.eventTypes;";
  const query = 'SELECT DISTINCT eventTypes.typeID, eventTypes.typeName, eventTypes.typeMetadata, IF(events.eventType IS NULL, FALSE, TRUE) as inUse ' + 
                'FROM LICCB.eventTypes ' +
                'LEFT JOIN LICCB.events ON (eventTypes.typeID = events.eventType)';
  let types = await conn.query(query)
  // console.log(types);
  conn.release();
  return types;
}

async function queryEventTypeByID(id){
  let conn = await pool.getConnection();
  const query = `SELECT * FROM LICCB.eventTypes WHERE typeID='${id}';`;
  let types = await conn.query(query)
  conn.release();
  return types;
}

async function insertEventType(type){
  const metadata = utils.getEventMetadata(type);
  const typeID = uuidv4();
  const insertStmt = "INSERT INTO LICCB.eventTypes " +
                        "(typeID, typeMetadata, typeName) " + 
                     `VALUES("${typeID}", '${metadata}', "${type.typeName}");`;
  console.log(insertStmt);
  let conn = await pool.getConnection();
  let insert = await conn.query(insertStmt);
  conn.release();
  return typeID;
}

async function deleteEventType(typeID){
  const delStmt = `DELETE FROM LICCB.eventTypes WHERE typeID='${typeID}'`;
  let conn = await pool.getConnection();
  let del = await conn.query(delStmt);
  conn.release();
  return del;
}

async function updateEventType(id, type){
  console.log(type);
  const md = utils.getEventMetadata(type);
  const query = 'UPDATE LICCB.eventTypes ' +
                `SET typeName='${type.typeName}', typeMetadata='${md}' ` +
                `WHERE typeID='${id}';`;
  console.log(query);
  let conn = await pool.getConnection();
  let upd = await conn.query(query);
  conn.release();
  return upd;
}

module.exports.queryAllUsers = queryAllUsers;
module.exports.queryEventsTableData = queryEventsTableData;
module.exports.queryAllEvents = queryAllEvents;
module.exports.queryEventByID = queryEventByID;
module.exports.queryEventDetailsByID = queryEventDetailsByID;
module.exports.queryParticipants = queryParticipants;
module.exports.queryParticipantByID = queryParticipantByID;
module.exports.queryParticipantsByNotID = queryParticipantsByNotID;
module.exports.tieParticipants = tieParticipants;
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
module.exports.queryParticipantsByEventAndParty = queryParticipantsByEventAndParty;
module.exports.updateParty = updateParty;
module.exports.queryRegistrantEmailsByEventID = queryRegistrantEmailsByEventID;
module.exports.queryParticipantsByEventAttr = queryParticipantsByEventAttr;
module.exports.queryEventTypeIDByName = queryEventTypeIDByName;
module.exports.querySpecificEvents = querySpecificEvents;
module.exports.queryAllUsers = queryAllUsers;
module.exports.queryUserByEmail = queryUserByEmail;
module.exports.queryUserByID = queryUserByID;
module.exports.updateUser = updateUser;
module.exports.insertUser = insertUser;
module.exports.disableUser = disableUser;
module.exports.enableUser = enableUser;
module.exports.deleteUser = deleteUser;
module.exports.insertEventType = insertEventType;
module.exports.queryEventTypes = queryEventTypes;
module.exports.queryEventTypeByID = queryEventTypeByID;
module.exports.deleteEventType = deleteEventType;
module.exports.updateEventType = updateEventType;
module.exports.queryEventTypeMetadata = queryEventTypeMetadata;