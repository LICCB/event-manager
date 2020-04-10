const config = require('./config.json');
const Sequelize = require('sequelize');
const utils = require('./utils');

// Initiate Sequelize with production database and connection pool
const sequelize = new Sequelize('LICCB', config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mariadb',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Verify database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database: ', err);
  });

const uuidv4 = require('uuid/v4');

async function queryAllCols(tableName) {
  let cols = await sequelize.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${tableName}'`, {type: sequelize.QueryTypes.SELECT});
  return cols;
}

async function queryAllUsers() {
  let users = await sequelize.query("SELECT * FROM users", {type: sequelize.QueryTypes.SELECT});
  return users;
}

async function queryAllEvents() {
  let events = await sequelize.query("SELECT * FROM events", {type: sequelize.QueryTypes.SELECT});
  return events;
}

async function queryEventsTableData(){
  const query = "SELECT eventID, eventName, firstName, lastName, eventStatus, privateEvent, startTime, endTime " +
                "FROM (events AS e) JOIN (users AS u) on " +
                      "e.managerID=u.userID;";
  let events = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return events;
}

async function queryParticipantsByEventID(eventID) {
  let participants = await sequelize.query(`SELECT * FROM participants WHERE eventID='${eventID}'`, {type: sequelize.QueryTypes.SELECT});
  return participants;
}

async function queryParticipantsByEventAttr(eventAttrs) {
  let queryString = `SELECT * FROM events as E, participants as P WHERE `;

  // Add all selected attributes to query
  let attrKeys = Object.keys(eventAttrs);
  for (let i = 0; i < attrKeys.length; i++) {
    if (eventAttrs[attrKeys[i]] != '') {
      queryString += `E.${attrKeys[i]} = '${eventAttrs[attrKeys[i]]}' AND `
    }
  }
  // Join events table with participants table to get participant data
  queryString += "E.eventID = P.eventID"
  let participants = await sequelize.query(queryString, {type: sequelize.QueryTypes.SELECT});
  return participants;
}

async function queryEventTypeIDByName(eventTypeName) {
  let participants = await sequelize.query(`SELECT typeID FROM eventTypes WHERE typeName='${eventTypeName}'`, {type: sequelize.QueryTypes.SELECT});
  return participants;
}

async function queryEventByID(eventID) {
  let event = await sequelize.query("SELECT * FROM events WHERE eventID= ?",
  {
    replacements: [eventID],
    type: sequelize.QueryTypes.SELECT
  });
  return event;
}

async function queryEventDetailsByID(eventID) {
  const query = "SELECT * " + 
                `FROM (SELECT * FROM events WHERE eventID='${eventID}') as E JOIN (SELECT * FROM users) AS U on E.managerID=U.userID ` +
                      `JOIN (SELECT * FROM eventTypes) AS T on E.eventType=T.typeID;`
  let event = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return event;
}

async function queryEventTypeMetadata(eventID) {
  const query = `SELECT typeMetadata FROM eventTypes WHERE typeID= (SELECT eventType FROM events WHERE eventID = '${eventID}')`;
  let metadata = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return metadata;
}

async function queryParticipants() {
  let participants = await sequelize.query("SELECT * FROM participants JOIN events ON participants.eventID=events.eventID",
  {
    type: sequelize.QueryTypes.SELECT
  });
  return participants;
}

async function queryParticipantsByEventID(eventID) {
  let participants = await sequelize.query("SELECT * FROM participants WHERE eventID = ?", 
  {
    replacements: [eventID],
    type: sequelize.QueryTypes.SELECT
  });
  return participants;
}

async function queryParticipantsByEventAndParty(eventID, partyID) {
  let participants = await sequelize.query("SELECT * FROM participants WHERE eventID = ? AND partyID = ? ORDER BY regTime",
  {
    replacements: [eventID, partyID],
    type: sequelize.QueryTypes.SELECT
  });
  return participants;
}

async function queryParticipantByID(participantID) {
  let participants = await sequelize.query("SELECT * FROM " +
                                           "(SELECT * FROM participants WHERE participantID = ?) AS p " +
                                           "JOIN events ON p.eventID=events.eventID",
  {
    replacements: [participantID],
    type: sequelize.QueryTypes.SELECT
  });
  return participants;
}

/*
 * Select all participants that haven't participated in any event that the
 * given participant has participated in.
 */
async function queryParticipantsByNotID(participantID) {
  let participants = await sequelize.query("SELECT * FROM " +
                                           "(SELECT * FROM participants " +
                                           "WHERE NOT participantID = ? AND " +
                                             "participantID NOT IN (SELECT participantID FROM participants " +
                                                                   "WHERE eventID IN (SELECT eventID FROM participants " +
                                                                                     "WHERE participantID = ?))) AS p " +
                                           "JOIN events ON p.eventID=events.eventID",
  {
    replacements: [participantID, participantID],
    type: sequelize.QueryTypes.SELECT
  });
  return participants;
}

async function tieParticipants(participantID, tieWithParticipantID) {
  let result = await sequelize.query("UPDATE participants " +
                                     "SET participantID = ?" +
                                     "WHERE participants.participantID = ?",
  {
    replacements: [participantID, tieWithParticipantID],
    type: sequelize.QueryTypes.UPDATE
  });
  return result;
}

async function checkinParticipant(participantID, eventID) {
  let participant = await sequelize.query("UPDATE participants " +
                                          "SET checkinStatus = 'Checked In' " +
                                          "WHERE participants.participantID = ? " +
                                                "AND participants.eventID = ?",
  {
    replacements: [participantID, eventID],
    type: sequelize.QueryTypes.UPDATE
  });
  return participant;
}

async function editUserComments(participantID, eventID, comment) {
  let participant = await sequelize.query("UPDATE participants " +
                                          "SET userComments = ? " +
                                          "WHERE participants.participantID = ? " +
                                                "AND participants.eventID = ?",
  {
    replacements: [comment, participantID, eventID],
    type: sequelize.QueryTypes.UPDATE
  });
  return participant;
}

async function deleteEvent(id) {
  let del = await sequelize.query("DELETE FROM events WHERE eventID='" + id + "'",
  {
    type: sequelize.QueryTypes.DELETE
  });
  return del;
}

async function insertEvent(event) {
  const eventMetadata = utils.getEventMetadata(event);
  const eventTypeMetadata = "";
  const eventID = uuidv4();
  const insertStmt = "INSERT INTO events " +
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
  let insert = await sequelize.query(insertStmt, {type: sequelize.QueryTypes.INSERT});
  return eventID;
}

async function archiveEvent(id) {
  const archive = "UPDATE events " + 
                  "SET " +
                    "eventStatus='Archived'" +              
                  "WHERE eventID='" + id + "';";
  let arc = await sequelize.query(archive, {type: sequelize.QueryTypes.UPDATE});
  return arc;
}

async function cancelEvent(id) {
  const cancel = "UPDATE events " + 
                  "SET " +
                    "eventStatus='Cancelled'" +              
                  "WHERE eventID='" + id + "';";
  let canc = await sequelize.query(cancel, {type: sequelize.QueryTypes.UPDATE});
  return canc;
}

async function publishEvent(id) {
  const publish = "UPDATE events " + 
                  "SET " +
                    "eventStatus='Registration Open'" +              
                  "WHERE eventID='" + id + "';";
  let pub = await sequelize.query(publish, {type: sequelize.QueryTypes.UPDATE});
  return pub;
}

async function updateEvent(event, id) {
  const eventMetadata = utils.getEventMetadata(event);
  const eventTypeMetadata = "";
  const dateTimeQuery = "Select startTime, endTime " + 
                        "From events " + 
                        `WHERE eventID='${id}';`;
  console.log(dateTimeQuery);
  const startTime = event.startDate + " " + event.startTime + ":00";
  const endTime = event.endDate + " " + event.endTime + ":00";
  const update = "UPDATE events " + 
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
  let oldDateTimes = await sequelize.query(dateTimeQuery, {type: sequelize.QueryTypes.SELECT});
  let upd = await sequelize.query(update, {type: sequelize.QueryTypes.UPDATE});
  return {
          oldStart : oldDateTimes[0].startTime,
          oldEnd : oldDateTimes[0].endTime,
          newStart : new Date(startTime),
          newEnd : new Date(endTime)
         };
}

async function confirmEmail(eventID, registrantID){
  const confirm = "UPDATE participants " + 
                  "SET " +
                    "regStatus='Registered' " +                 
                  `WHERE eventID='${eventID}' AND partyID='${registrantID}';`;
  const query = "SELECT email, eventName " + 
                 "FROM " + 
                        `(SELECT * FROM participants WHERE participantID='${registrantID}' AND eventID='${eventID}') AS p ` + 
                 "JOIN " + 
                        `(SELECT * FROM events WHERE eventID='${eventID}') AS e on ` + 
                        "p.eventID = e.eventID;";
  let update = await sequelize.query(confirm, {type: sequelize.QueryTypes.UPDATE});
  let vals = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
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
  const queryStmt = "SELECT participantID FROM participants WHERE eventID != ? AND ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?)";
  const query = await sequelize.query(queryStmt,
  {
    replacements: [eventID, signup.regfirstname, signup.reglastname, signup.regemail, signup.regphone],
    type: sequelize.QueryTypes.SELECT
  });
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
  var insertStmt = "INSERT INTO participants " +
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
  let insert = await sequelize.query(insertStmt,
  {
    replacements: [eventID, signup.regfirstname, signup.reglastname, signup.regphone, signup.regemail, signup.regephone, signup.regename, signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, metadata],
    type: sequelize.QueryTypes.INSERT
  });

  for(i = 1; i <= partsize; i++) {
    const queryStmt = "SELECT participantID FROM participants WHERE eventID != ? AND ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?)";
    const query = await sequelize.query(queryStmt,
    {
      replacements: [eventID, signup.regfirstname, signup.reglastname, signup.regemail, signup.regphone],
      type: sequelize.QueryTypes.SELECT
    });
    var newParticipantID = uuidv4();
    if(query[0] != undefined) {
      newParticipantID = query[0].participantID;
    }
    var insertStmt1 = "INSERT INTO participants " +
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
    let insert = await sequelize.query(insertStmt1,
    {
      replacements: [eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, metadata],
      type: sequelize.QueryTypes.INSERT
    });
  console.log(eventID);
  console.log(registrantID);
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
  const update = "UPDATE participants " +
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
  let insert = await sequelize.query(update,
  {
    replacements: [signup.eventID, signup.regfirstname, signup.reglastname, signup.regphone, signup.regemail, signup.regephone, signup.regename, signup.zipcode, signup.regadult, signup.regcpr, signup.regboat, signup.bhdiscovery, signup.eventdiscovery, signup.notes, eventID, partyID, partyID],
    type: sequelize.QueryTypes.UPDATE
  });

  var partIds = signup.partIDs;
  for(i = 1; i <= partsize; i++) {
    var newParticipantID = uuidv4();
    console.log(signup[`part${i}ID`]);
    var updateStmt = "IF EXISTS (SELECT * FROM participants " + 
      "WHERE eventID=? AND partyID=? AND participantID=? AND firstName = ? AND lastName = ?) " +
      "THEN UPDATE participants SET " +
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
      "INSERT INTO participants VALUES(" +
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
    let insert = await sequelize.query(updateStmt,
    {
      replacements: [eventID, partyID, signup[`part${i}ID`], signup[`part${i}fname`], signup[`part${i}lname`], signup.eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup.zipcode, signup[`part${i}age`], signup[`part${i}cpr`], signup[`part${i}swim`], signup[`part${i}boat`], signup.bhdiscovery, signup.eventdiscovery, signup.notes, eventID, partyID, signup[`part${i}ID`], partyID, signup.eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup.zipcode, signup[`part${i}age`], signup[`part${i}cpr`], signup[`part${i}swim`], signup[`part${i}boat`], signup.bhdiscovery, signup.eventdiscovery, signup.notes],
    });
  }
  if(partsize < signup.partIDs.length) {
    //loop through participants who need to be deleted
    //CHECK IF THERE IS MORE THAN ONE ENTRY IF NOT DONT LOOP THROUGH DO partIds
    for(i = 0; i < signup.partIDs.length; i++) {
      console.log(partIds[i]);
      deleteStmt = "UPDATE participants " +
      "SET " +
      "partyID='' " + 
      "WHERE eventID=? AND partyID=? AND participantID=?;";
    let insert = await sequelize.query(deleteStmt,
    {
      replacements: [eventID, partyID, partIds[i]],
      type: sequelize.QueryTypes.UPDATE
    });
    }
  }
  return partyID;
}

async function querySpecificEvents(choice) {
  var query = "";
  if (choice == 1) {
    query = "SELECT * " +
                "FROM events " +
                "WHERE eventStatus = 'Registration Open';";
  } else {
    query = "SELECT * " +
                "FROM events " +
                "WHERE eventStatus = 'Registration Open' AND privateEvent = 0;";
  }
  
  let events = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return events;
}

async function queryRegistrantEmailsByEventID(eventID){
  const query = "SELECT email " + 
                "FROM participants " +
                `WHERE eventID='${eventID}' and email !='';`; 
  let emails = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return emails.map(function (x) {
    return Object.values(x);
    },
    emails.slice(0, emails.length - 1)).flat();
}

async function queryAllUsers(){
  const query = 'SELECT * FROM users;';
  console.log(query);
  let user = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return user;
}

async function queryUserByEmail(email){
  const query = `SELECT * FROM users WHERE email='${email}';`;
  console.log(query);
  let user = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return user;
}

async function queryUserByID(userID){
  const query = `SELECT * FROM users WHERE userID='${userID}';`;
  console.log(query);
  let user = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return user;
}

async function updateUser(email, googleID, fname, lname){
  const query = 'UPDATE users ' +
                `SET googleID='${googleID}', firstName='${fname}', lastName='${lname}' ` +
                `WHERE email='${email}';`;
  console.log(query);
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function insertUser(email, fName, lName){
  const userID = uuidv4();
  const query = 'INSERT INTO users ' +
                '(userID, email, googleID, firstName, lastName, userEnabled) ' +
                `VALUES('${userID}', '${email}', '${userID}', '${fName}', '${lName}', 1)`; // set googleID to userID until first login
  console.log(query);
  let insert = await conn.query(query, {type: sequelize.QueryTypes.INSERT});
  return insert;
}

async function disableUser(id){
  const query = `UPDATE users SET userEnabled=0 WHERE userID='${id}';`;
  console.log(query);
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function enableUser(id){
  const query = `UPDATE users SET userEnabled=1 WHERE userID='${id}';`;
  console.log(query);
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function deleteUser(id){
  const query = `DELETE FROM users WHERE userID='${id}';`;
  console.log(query);
  let del = await sequelize.query(query, {type: sequelize.QueryTypes.DELETE});
  return del;
}

async function queryEventTypes(){
  // const query = "SELECT * FROM eventTypes;";
  const query = 'SELECT DISTINCT eventTypes.typeID, eventTypes.typeName, eventTypes.typeMetadata, IF(events.eventType IS NULL, FALSE, TRUE) as inUse ' + 
                'FROM eventTypes ' +
                'LEFT JOIN events ON (eventTypes.typeID = events.eventType)';
  let types = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
  // console.log(types);
  return types;
}

async function queryEventTypeByID(id){
  const query = `SELECT * FROM eventTypes WHERE typeID='${id}';`;
  let types = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
  return types;
}

async function insertEventType(type){
  const metadata = utils.getEventMetadata(type);
  const typeID = uuidv4();
  const insertStmt = "INSERT INTO eventTypes " +
                        "(typeID, typeMetadata, typeName) " + 
                     `VALUES("${typeID}", '${metadata}', "${type.typeName}");`;
  console.log(insertStmt);
  let insert = await sequelize.query(insertStmt, {type: sequelize.QueryTypes.INSERT});
  return typeID;
}

async function deleteEventType(typeID){
  const delStmt = `DELETE FROM eventTypes WHERE typeID='${typeID}'`;
  let del = await sequelize.query(delStmt, {type: sequelize.QueryTypes.DELETE});
  return del;
}

async function updateEventType(id, type){
  console.log(type);
  const md = utils.getEventMetadata(type);
  const query = 'UPDATE eventTypes ' +
                `SET typeName='${type.typeName}', typeMetadata='${md}' ` +
                `WHERE typeID='${id}';`;
  console.log(query);
  let upd = await conn.query(query, {type: sequelize.QueryTypes.UPDATE});
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