const logger = require('./logger');
const config = require((process.env.LICCB_MODE !== undefined && process.env.LICCB_MODE == 'testing') ? './test-config.json': './config.json');
const Sequelize = require('sequelize');
const utils = require('./utils');

// Initiate Sequelize with production database and connection pool
const sequelize = new Sequelize('LICCB', config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mariadb',
  logging: logger.log,
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
    logger.log('Database connection has been established successfully.', 'info');
  })
  .catch(err => {
    logger.log('Unable to connect to the database:', 'error');
    logger.log(err, 'error');
  });

const uuidv4 = require('uuid/v4');

async function queryAllCols(tableName) {
  let cols = await sequelize.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${tableName}'`, {type: sequelize.QueryTypes.SELECT});
  return cols;
}

async function queryAllUsers() {
  const query = 'SELECT * ' +
                'FROM users JOIN roles ' + 
                'ON users.roleID = roles.roleID ' + 
                'ORDER BY users.lastName, users.firstName;';
  let users = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return users;
}

async function queryAllEvents() {
  let events = await sequelize.query("SELECT * FROM events", {type: sequelize.QueryTypes.SELECT});
  return events;
}

async function queryAllEventNames() {
  let events = await sequelize.query("SELECT eventID FROM events", {type: sequelize.QueryTypes.SELECT});
  return events;
}

async function queryEventsTableData(){
  const query = "SELECT eventID, eventName, firstName, lastName, eventStatus, privateEvent, startTime, endTime " +
                "FROM (events AS e) JOIN (users AS u) on " +
                      "e.managerID=u.userID;";
  let events = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return events;
}

async function queryParticipantsByEventAttr(eventAttrs) {
  let queryString = `SELECT * FROM events as E, participants as P WHERE `;

  // Add all selected attributes to query
  let attrKeys = Object.keys(eventAttrs);
  for (let i = 0; i < attrKeys.length; i++) {
    if (eventAttrs[attrKeys[i]] != '') {
      queryString += `E.${attrKeys[i]} = '${eventAttrs[attrKeys[i]]}' AND `;
    }
  }
  // Join events table with participants table to get participant data
  queryString += "E.eventID = P.eventID";
  let participants = await sequelize.query(queryString, {type: sequelize.QueryTypes.SELECT});
  return participants;
}

async function queryEventTypeIDByName(eventTypeName) {
  let participants = await sequelize.query(`SELECT typeID FROM eventTypes WHERE typeName='${eventTypeName}'`, {type: sequelize.QueryTypes.SELECT});
  return participants;
}

async function queryParticipantsNotReady(eventID) {
  status = "Awaiting Confirmation";
  status2='Not Confirmed';
  status3='Not Selected';
  status4= 'Standby';
  status5='Selected';
  status6='Cancelled';
  status7='Same Day Cancel';
  let participants = await sequelize.query(`SELECT * FROM participants WHERE eventID='${eventID}' AND regStatus='${status}' OR regStatus='${status2}' OR regStatus='${status3}' OR regStatus='${status4}' OR regStatus='${status5}' OR regStatus='${status6}' OR regStatus='${status7}'`, {type: sequelize.QueryTypes.SELECT});
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
                      `JOIN (SELECT * FROM eventTypes) AS T on E.eventType=T.typeID;`;
  let event = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return event;
}

async function queryEventTypeMetadata(eventID) { //takes in an eventID and returns the metadata for the eventType the event is
  const query = `SELECT typeMetadata FROM eventTypes WHERE typeID= (SELECT eventType FROM events WHERE eventID = '${eventID}')`;
  let metadata = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return metadata;
}

async function queryEventStatusByID(eventID) {
  status="status";
  let event = await sequelize.query("SELECT eventStatus " +
                               "FROM events " +  
                               "WHERE eventID = '" + eventID + "'",
                              {type: sequelize.QueryTypes.SELECT});
  return event;  
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

async function queryParticipantsByEventAndParty(eventID, partyID) {//Takes in eventID and partyID and returns the participants in the given party for the given event
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
                                     "SET partyID = ?" +
                                     "WHERE participants.partyID = ?",
  {
    replacements: [tieWithParticipantID, participantID],
    type: sequelize.QueryTypes.UPDATE
  });
  result = await sequelize.query("UPDATE participants " +
                                     "SET participantID = ?" +
                                     "WHERE participants.participantID = ?",
  {
    replacements: [tieWithParticipantID, participantID],
    type: sequelize.QueryTypes.UPDATE
  });
  return result;
}

async function changeParticipantStatus(participantID, eventID, statusToChange) {
  let updateParticipant = await sequelize.query("UPDATE participants " +
                                           `SET regStatus = '${statusToChange}' ` +
                                           "WHERE participants.participantID = '" + participantID + "' " +
                                           "AND participants.eventID = '" + eventID + "'", {type: sequelize.QueryTypes.UPDATE});
  return "success";
}

async function queryParticipantsByParticpantAttr(eventID, participantAttrs) {
  let queryString = `SELECT P.participantID FROM events as E, participants as P WHERE `;

  // Add all selected attributes to query
  let attrKeys = Object.keys(participantAttrs);
  for (let i = 0; i < attrKeys.length; i++) {
    if (participantAttrs[attrKeys[i]] != '') {
      queryString += `P.${attrKeys[i]} = '${participantAttrs[attrKeys[i]]}' AND `;
    }
  }
  // Join events table with participants table to get participant data
  queryString += `E.eventID = P.eventID AND E.eventID='${eventID}'`;
  let participants = await sequelize.query(queryString, {type: sequelize.QueryTypes.SELECT});
  return participants;
}

async function resetParticipantsStatus(eventID) {
  let resetParticipants = await sequelize.query("UPDATE participants " +
                                           "SET regStatus='Registered' " +
                                           "WHERE participants.regStatus = 'Selected' " +
                                           "AND participants.eventID = '" + eventID + "'", {type: sequelize.QueryTypes.UPDATE});
  return resetParticipants;
}

async function selectAllParticipantStatus(eventID) {
  let selectAll = await sequelize.query("UPDATE participants " +
                                           "SET regStatus='Selected' " +
                                           "AND participants.eventID = '" + eventID + "'", {type: sequelize.QueryTypes.UPDATE});
  return selectAll;
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

// initializes run selection process
async function runSelectionDefault(eventID) {
  // populate all contenders into new table
  let returnSelectedRegistrants = await sequelize.query("SELECT * " +  
                                                    "FROM participants " +  
                                                    "WHERE eventID = '" + eventID + "'" +
                                                    "ORDER BY regTime", {type: sequelize.QueryTypes.SELECT});
  return returnSelectedRegistrants;
}
// initializes run selection process
async function runSelectionRandom(eventID) {
  let returnSelectedRegistrants = await sequelize.query("SELECT * " +
                                                    " FROM participants" +  
                                                    " WHERE eventID = '" + eventID + "'" +
                                                    " AND regStatus='Registered'" +
                                                    " AND isAdult='1'" +
                                                    " ORDER BY regTime",
                                                    {type: sequelize.QueryTypes.SELECT});
  return returnSelectedRegistrants;
}

async function getCapacityFromEventID(eventID) {
  let capacity = await sequelize.query("SELECT capacity " +  
                                  "FROM events " +  
                                  "WHERE eventID = '" + eventID + "'",
                                  {type: sequelize.QueryTypes.SELECT});
  return capacity;  
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
  logger.log(dateTimeQuery);
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
                "WHERE eventID='" + id + "';";
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
  logger.log("Signup: " + signup);
  const date = utils.getDateTime(); //use the function in the utils file to get the current date and time(time including milliseconds) and format it correctly to insert into the SQL statment
  var signupkeys = Object.keys(signup).length; //number of fields in the signup form
  var partysize = 0; //variable to track the size of the party, used in conjunction with the signup keys to determine how many extra party members need to be inserted
  const event = (await queryEventByID(eventID))[0]; //used to check the extra questions for the event(defined for that event specifically)
  var eventTypeFields = (await queryEventTypeMetadata(eventID))[0].typeMetadata; //eventType extra questions 
  var metadataFieldsCount = 0;
  if(event.eventMetadata != '{}' && event.eventMetadata != null) { //add number of extra questions asked based on the specific event
    metadataFieldsCount += Object.keys(JSON.parse(event.eventMetadata)).length;
  }
  if(eventTypeFields != '{}' && eventTypeFields != null) { //add number of extra questions asked based on the event type
    metadataFieldsCount += Object.keys(JSON.parse(eventTypeFields)).length;
  }
  logger.log("Before metadata:" + signupkeys);
  signupkeys = signupkeys - metadataFieldsCount; //subtract number of extra questions(event type and event specific) from the total number of questions asked
  logger.log("After metadata:" + signupkeys);
  if(volunteerStatus == 1) { //subtracts extra questions asked if they are signing up as a volunteer
    signupkeys = signupkeys - 2;
  }
  logger.log("final:" + signupkeys);
  if(signupkeys > 15) { //if the new count of signup keys(questions asked on form - extra questions asked) is greater than 15(base amount of questions asked for a single person sign up with no extra questions) the signup has more than 1 person in the party
    partysize = (signupkeys - 15) / 11; //calculate the number of extra party members signing up on the form(extra party members are asked 11 questions)

  }
  logger.log(`insertParty: Party size: ${partysize + 1}`, 'info');
  const queryStmt = "SELECT participantID FROM participants WHERE ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?) AND participantID NOT IN (SELECT participantID FROM participants WHERE eventID = ?);";
  const query = await sequelize.query(queryStmt, //query will return the participantID of the registrant if they have signed up for an event before(but not the current event being signed up for as this will cause a duplicate key error). The first last name combo, phone number, and email are used to search
  {
    replacements: [signup.regfirstname, signup.reglastname, signup.regemail, signup.regphone, eventID],
    type: sequelize.QueryTypes.SELECT
  });
  var registrantID = uuidv4(); //generates new participantID 
  logger.log(`List of participants possible existing participants: ${query[0]}`);
  if(query[0] != undefined) { //if the query returned a participantID, they have signed up for an event in the past, and the same participantID instead of the new one just generated above
    registrantID = query[0].participantID;
  }
  var eventSpecificMetadata; //variable to hold object that will store the question/answer combinations for the event specific extra questions in the form
  if(event.eventMetadata != '{}' && event.eventMetadata != null) { //if there are extra event specific questions being asked, add their question name/answer pairs to the object using the utils function written
    eventSpecificMetadata = utils.eventMetadataWrapper(signup, event.eventMetadata);
    eventSpecificMetadata = JSON.parse(eventSpecificMetadata); //utils function returns JSON object as a string, convert it back to an object
    eventSpecificMetadata = Object.assign({}, eventSpecificMetadata);
  }
  var eventTypeMetadata; //variable to hold object that will store the question/answer combinations for the event type extra questions in the form
  if(eventTypeFields != '{}' && eventTypeFields != null){ //if there are extra event type questions being asked, add their question name/answer pairs to the object using the utils function written
    eventTypeMetadata = utils.eventMetadataWrapper(signup, eventTypeFields);
    eventTypeMetadata = JSON.parse(eventTypeMetadata); //utils function returns JSON object as a string, convert it back to an object
    eventTypeMetadata = Object.assign({}, eventTypeMetadata);
  }
  logger.log("eventSpecificMetadata:" + JSON.stringify(eventSpecificMetadata));
  logger.log("eventTypeMetadata:" + JSON.stringify(eventTypeMetadata));
  if((eventSpecificMetadata == undefined || eventSpecificMetadata == '{}') && (eventTypeMetadata == undefined || eventTypeMetadata == '{}')) { //if no event type or event specific questions were asked, assign the metadata variable to be an empty JSON object
    metadata = {};
  } else if(eventSpecificMetadata == undefined || eventSpecificMetadata == '{}') { //if there are no event specific questions asked, assign the metadata variable to be object with the event type question/answer pairs
    metadata = eventTypeMetadata;
  } else if(eventTypeMetadata == undefined || eventTypeMetadata == '{}') { //if there are no event type questions asked, assign the metadata variable to be object with the event type question/answer pairs
    metadata = eventSpecificMetadata;
  } else { //if there are both event specific and event type questions asked, metadata will be equal to both objects combined with each other
    metadata = Object.assign(eventSpecificMetadata, eventTypeMetadata);
  } //metadata variable will be the JSON object that contains the question name and answers from the form that is used to insert into the Database for this signup
  
  logger.log("metadata:" + JSON.stringify(metadata));
  var insertStmt = "INSERT INTO participants " +
    "(participantID, partyID, eventID, firstName, " +
    "lastName, phone, email, emergencyPhone, emergencyName, emergencyRelation, zip, " +
    "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
    "eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata) " +
    "VALUES(" +
    "'" + registrantID + "', " + //participantID
    "'" + registrantID + "', " + //partyID (partyID = registrantID for any signup)
    "?, " + //eventID
    "?, " + //firstName
    "?, " + //lastName
    "?, " + //phone
    "?, " + //email
    "?, " + //emergencyPhone
    "?, " + //emergencyName
    "?, " + //emergencyRelation
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
    "?);"; //metadata
  
  let insert = await sequelize.query(insertStmt,
  {
    replacements: [eventID, signup.regfirstname, signup.reglastname, signup.regphone, signup.regemail, signup.regephone, signup.regename, signup.regerelation, signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, JSON.stringify(metadata)],
    type: sequelize.QueryTypes.INSERT
  });
  logger.log(`insertParty: Registrant: ${registrantID} signed up for event:${eventID} successfully`, 'info');
  
  for(i = 1; i <= partysize; i++) { //loop to add extra party members, if there are any, according to partysize variable calculated above
    const queryStmt = "SELECT participantID FROM participants WHERE ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?) AND participantID NOT IN (SELECT participantID FROM participants WHERE eventID = ?);";
    const query = await sequelize.query(queryStmt,
    {
      replacements: [signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], eventID],
      type: sequelize.QueryTypes.SELECT
    }); //check to make sure the extra party member has signed up for an event in the past, similar to check done above for registrant
    var newParticipantID = uuidv4();
    if(query[0] != undefined) {
      newParticipantID = query[0].participantID;
    }
    var insertStmt1 = "INSERT INTO participants " +
      "(participantID, partyID, eventID, firstName, " +
      "lastName, phone, email, emergencyPhone, emergencyName, emergencyRelation, zip, " +
      "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
      "eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata)" +
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
      "?, " + //emergencyRelation
      "?, " + //zipcode
      signup[`part${i}adult`] + ", " + //isAdult
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
        insertStmt1 += "null, " + //priorVolunteer
        "null, ";//roleFamiliarity
      }
      insertStmt1 += "'Awaiting Confirmation', " + //regStatus
      "'Pending', " + //checkinStatus
      "?, " + //volunteer
      "'" + date + "', " + //regTime
      "'', " + //userComments
      "?);"; //metadata

    let insert = await sequelize.query(insertStmt1,
    {
      replacements: [eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup[`part${i}erelation`], signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, JSON.stringify(metadata)],
      type: sequelize.QueryTypes.INSERT
    });
    logger.log(`insertParty: Participant: ${newParticipantID} signed up for event:${eventID} successfully`, 'info');
  }
  logger.log(`insertParty: ${partysize + 1} participants signed up for event: ${eventID} under partyID:${registrantID}`, 'info');
  logger.log(`insertParty: Edit Registration Link: /editRegistration/${eventID}/${registrantID}`);
  return registrantID;
}

async function updateParty(signup, eventID, partyID) {
  logger.log("updateParty: " + signup);
  const date = utils.getDateTime();
  var signupkeys = Object.keys(signup).length;
  var partysize = 0;
  var deleteCount = 0;
  var newCount = 0;
  const event = (await queryEventByID(eventID))[0];
  var eventTypeFields = (await queryEventTypeMetadata(eventID))[0].typeMetadata;
  var metadataFieldsCount = 0;

  const partyMembersQueryStmt = "SELECT participantID, firstName, lastName FROM participants WHERE eventID = ? AND partyID = ? AND participantID != ?;";
  const partyMembers = await sequelize.query(partyMembersQueryStmt,
  {
    replacements: [eventID, partyID, partyID],
    type: sequelize.QueryTypes.SELECT
  }); //query returns list of participants, minus the registrant, in the given party for the given event that is currently signed up, before edit takes place
  //field count is the same as insertParty function
  if(event.eventMetadata != '{}' && event.eventMetadata != null) {
    metadataFieldsCount += Object.keys(JSON.parse(event.eventMetadata)).length;
  }
  if(eventTypeFields != '{}' && eventTypeFields != null) {
    metadataFieldsCount += Object.keys(JSON.parse(eventTypeFields)).length;
  }
  logger.log("updateParty: Before metadata:" + signupkeys);
  signupkeys = signupkeys - metadataFieldsCount;
  logger.log("updateParty: After metadata:" + signupkeys);

  const volunteerStatusQueryStmt = "SELECT volunteer FROM participants WHERE eventID = ? AND participantID = ?;";
  const volunteerStatusQuery = await sequelize.query(volunteerStatusQueryStmt,
  {
    replacements: [eventID, partyID],
    type: sequelize.QueryTypes.SELECT
  });
  const volunteerStatus = volunteerStatusQuery[0].volunteer;
  logger.log("updateParty: volunteerStatus:" + volunteerStatus);

  if(volunteerStatus == 1) {
    signupkeys = signupkeys - 2;
  }
  logger.log("final:" + signupkeys);
  if(signupkeys > 15) {
    partysize = (signupkeys - 15) / 11;
  }
  logger.log(`updateParty: Party size: ${partysize + 1}`, 'info');

  var eventSpecificMetadata;
  if(event.eventMetadata != '{}' && event.eventMetadata != null) {
    eventSpecificMetadata = utils.eventMetadataWrapper(signup, event.eventMetadata);
    eventSpecificMetadata = JSON.parse(eventSpecificMetadata);
    eventSpecificMetadata = Object.assign({}, eventSpecificMetadata);
  }
  var eventTypeMetadata;
  if(eventTypeFields != '{}' && eventTypeFields != null){
    eventTypeMetadata = utils.eventMetadataWrapper(signup, eventTypeFields);
    eventTypeMetadata = JSON.parse(eventTypeMetadata);
    eventTypeMetadata = Object.assign({}, eventTypeMetadata);
  }
  logger.log("updateParty: eventSpecificMetadata:" + JSON.stringify(eventSpecificMetadata));
  logger.log("updateParty: eventTypeMetadata:" + JSON.stringify(eventTypeMetadata));
  if((eventSpecificMetadata == undefined || eventSpecificMetadata == '{}') && (eventTypeMetadata == undefined || eventTypeMetadata == '{}')) {
    metadata = {};
  } else if(eventSpecificMetadata == undefined || eventSpecificMetadata == '{}') {
    metadata = eventTypeMetadata;
  } else if(eventTypeMetadata == undefined || eventTypeMetadata == '{}') {
    metadata = eventSpecificMetadata;
  } else {
    metadata = Object.assign(eventSpecificMetadata, eventTypeMetadata);
  }
  var update = "UPDATE participants " + //update SQL statment for updating the registrant
    "SET " +
    "phone=?, " + //phone
    "email=?, " + //email
    "emergencyPhone=?, " + //emergencyPhone
    "emergencyName=?, " + //emergencyName
    "emergencyRelation=?, " + //emergencyRelation
    "zip=?, " + //zip
    "isAdult=" + signup.regadult + " ," + //isAdult
    "hasCPRCert=" + signup.regcpr + " ," + //hasCPRCert
    "canSwim=" + signup.regswim + " ," + //canSwim
    "boatExperience=" + signup.regboat + " ," + //boatExperience
    "boathouseDisc=?, " + //boathouse discovery
    "eventDisc=?, " + //event discvoery
    "regComments=?, "; //regComments
    if(volunteerStatus == 1) { //Add volunteer fields if they are a volunteer
      update += "priorVolunteer=" + signup.priorVolunteer + ", " + //priorVolunteer
      "roleFamiliarity=" + signup.roleFamiliarity + ", "; //roleFamiliarity
    }
    update += "metadata=? " + //metadata 
    "WHERE eventID=? AND partyID=? AND participantID=?;";
  let insert = await sequelize.query(update,
  {
    replacements: [signup.regphone, signup.regemail, signup.regephone, signup.regename, signup.regerelation, signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, JSON.stringify(metadata), eventID, partyID, partyID],
    type: sequelize.QueryTypes.UPDATE
  });

  logger.log(`updateParty: Registrant: ${partyID} updated their registration for event: ${eventID}`,'info');

  var memberCheck = {}; //object used to count if a party member a new party member, not an update, and needs to be added to the party
  for(i = 1; i <= partysize; i++) {
    memberCheck[i] = 0;
  }

  var del = 0;
  for(i = 0; i < partyMembers.length; i++) { //loops through party members in the pre update party 
    if(partysize < 1) { del = 1; } //if the new signup has no additional party members, delete currently selected party member in pre update party members list
    for(j = 1; j <= partysize; j++) { //loop through party members in the updated signup form
      del = 0;
      
      if(signup[`part${j}fname`] + signup[`part${j}lname`] == partyMembers[i].firstName + partyMembers[i].lastName) { //if current party member in the signup form is the party member in the partyMembers list, update
        update = "UPDATE participants " +
        "SET " +
        "phone=?, " + //phone
        "email=?, " + //email
        "emergencyPhone=?, " + //emergencyPhone
        "emergencyName=?, " + //emergencyName
        "emergencyRelation=?, " + //emergencyRelation
        "zip=?, " + //zip
        "isAdult=" + signup[`part${j}adult`] + " ," + //isAdult
        "hasCPRCert=" + signup[`part${j}cpr`] + " ," + //hasCPRCert
        "canSwim=" + signup[`part${j}swim`] + " ," + //canSwim
        "boatExperience=" + signup[`part${j}boat`] + " ," + //boatExperience
        "boathouseDisc=?, " + //boathouse discovery
        "eventDisc=?, " + //event discvoery
        "regComments=?, "; //regComments
        if(volunteerStatus == 1) { //Add volunteer fields if they are a volunteer
          update += "priorVolunteer=" + signup.priorVolunteer + ", " + //priorVolunteer
          "roleFamiliarity=" + signup.roleFamiliarity + ", "; //roleFamiliarity
        }
        update += "metadata=? " + //metadata 
        "WHERE eventID=? AND partyID=? AND participantID=?;";
        let insert = await sequelize.query(update,
        {
          replacements: [signup[`part${j}phone`], signup[`part${j}email`], signup[`part${j}ephone`], signup[`part${j}ename`], signup[`part${j}erelation`], signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, JSON.stringify(metadata), eventID, partyID, partyMembers[i].participantID],
          type: sequelize.QueryTypes.UPDATE
        });
        logger.log(`updateParty: Participant: ${partyMembers[i].participantID} updated their registration for event: ${eventID}`,'info');
        del = 0;
        break;
      } else { //if the current partymember in the list of original party members is not in the signup form, the partymember is to be deleted
        memberCheck[i] ++;
        del = 1; //set party member in list of original party members to be removed
      }
    }

    if(del == 1) {//check if the original party member needs to be removed
      deleteStmt = "UPDATE participants " +
        "SET " +
        "partyID=null, " + 
        "regStatus = 'Cancelled' " +
        "WHERE eventID=? AND partyID=? AND participantID=?;"; //to remove party member, set partyID to null and regStatus to Cancelled. Keep row in the DB for history tracking
      let deletion = await sequelize.query(deleteStmt,
      {
        replacements: [eventID, partyID, partyMembers[i].participantID],
        type: sequelize.QueryTypes.UPDATE
      });
      logger.log(`updateParty: Participant: ${partyMembers[i].participantID} was removed from party: ${partyID} for event: ${eventID}`,'info');
      deleteCount++;
    }
  }

  for(i = 1; i <= partysize; i++) { //loop to look at party members in updated signup form
    if(memberCheck[i] == partyMembers.length) { //if the partymember is never included in the original party member list, this is a new party member and a new entry must be created
      const queryStmt = "SELECT participantID FROM participants WHERE ((firstName = ? AND lastName = ?) OR email = ?  OR phone = ?) AND participantID NOT IN (SELECT participantID FROM participants WHERE eventID = ?);";
      const query = await sequelize.query(queryStmt,
      {
        replacements: [signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], eventID],
        type: sequelize.QueryTypes.SELECT
      }); //history check same as in insertParty 
      var newParticipantID = uuidv4();
      if(query[0] != undefined) {
        newParticipantID = query[0].participantID;
      }
      var insertStmt1 = "INSERT INTO participants " +
        "(participantID, partyID, eventID, firstName, " +
        "lastName, phone, email, emergencyPhone, emergencyName, emergencyRelation, zip, " +
        "isAdult, hasCPRCert, canSwim, boatExperience, boathouseDisc, " +
        "eventDisc, regComments, priorVolunteer, roleFamiliarity, regStatus, checkinStatus, volunteer, regTime, userComments, metadata)" +
        "VALUES(" +
        "'" + newParticipantID + "', " + //participantID
        "'" + partyID + "', " + //partyID
        "?, " + //eventID
        "?, " + //firstName
        "?, " + //lastName
        "?, " + //phone
        "?, " + //email
        "?, " + //emergencyPhone
        "?, " + //emergencyName
        "?, " + //emergencyRelation
        "?, " + //zipcode
        signup[`part${i}adult`] + ", " + //isAdult
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
        "?);"; //metadata

      let insert = await sequelize.query(insertStmt1,
      {
        replacements: [eventID, signup[`part${i}fname`], signup[`part${i}lname`], signup[`part${i}phone`], signup[`part${i}email`], signup[`part${i}ephone`], signup[`part${i}ename`], signup[`part${i}erelation`], signup.zipcode, signup.bhdiscovery, signup.eventdiscovery, signup.notes, volunteerStatus, JSON.stringify(metadata)],
        type: sequelize.QueryTypes.INSERT
      });
      newCount++;
    }
  }
  logger.log(`updateParty: Party: ${partyID} for event: ${eventID} was updated. ${newCount} new participants added to the party. ${deleteCount} participants removed from the party`, 'info');
  return partyID;
}

async function querySpecificEvents(choice) {
  var query = "";
  if (choice == 1) {
    query = "SELECT * " +
                "FROM events " +
                "WHERE eventStatus = 'Registration Open' ORDER BY startTime;";
  } else {
    query = "SELECT * " +
                "FROM events " +
                "WHERE eventStatus = 'Registration Open' AND privateEvent = 0 ORDER BY startTime;";
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

async function queryUserByEmail(email){
  const query = `SELECT * FROM users WHERE email='${email}';`;
  logger.log(query);
  let user = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return user;
}

async function queryUserByID(userID){
  const query = `SELECT * FROM users WHERE userID='${userID}';`;
  logger.log(query);
  let user = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return user;
}

async function updateUser(email, googleID, pictureURL){
  const query = 'UPDATE users ' +
                `SET googleID='${googleID}', pictureURL='${pictureURL}' ` +
                `WHERE email='${email}';`;
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function editUser(id,email, fName, lName, roleID){
  const query = 'UPDATE users ' +
                `SET email='${email}', firstName='${fName}', lastName='${lName}', roleID='${roleID}' ` +
                `WHERE userID='${id}';`;
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function insertUser(email, fName, lName){
  const userID = uuidv4();
  const query = 'INSERT INTO users ' +
                '(userID, email, googleID, firstName, lastName, userEnabled, pictureURL, roleID) ' +
                `VALUES('${userID}', '${email}', '${userID}', '${fName}', '${lName}', 1, '', '7d4666ef-2d92-4f8a-ae4f-6b61d568031b')`; // set googleID to userID until first login
  logger.log(query);
  let insert = await sequelize.query(query, {type: sequelize.QueryTypes.INSERT});
  return insert;
}

async function disableUser(id){
  const query = `UPDATE users SET userEnabled=0 WHERE userID='${id}';`;
  logger.log(query);
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function enableUser(id){
  const query = `UPDATE users SET userEnabled=1 WHERE userID='${id}';`;
  logger.log(query);
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function deleteUser(id){
  const query = `DELETE FROM users WHERE userID='${id}';`;
  logger.log(query);
  let del = await sequelize.query(query, {type: sequelize.QueryTypes.DELETE});
  return del;
}

async function queryEventTypes(){
  const query = 'SELECT DISTINCT eventTypes.typeID, eventTypes.typeName, eventTypes.typeMetadata, IF(events.eventType IS NULL, FALSE, TRUE) as inUse ' + 
                'FROM eventTypes ' +
                'LEFT JOIN events ON (eventTypes.typeID = events.eventType) ' + 
                'ORDER BY eventTypes.typeName';
  let types = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
  // logger.log(types);
  return types;
}

async function queryEventTypeByID(id){
  const query = `SELECT * FROM eventTypes WHERE typeID='${id}';`;
  let types = await sequelize.query(query, {type: sequelize.QueryTypes.SELECT});
  return types;
}

async function insertEventType(type){
  const metadata = utils.getEventMetadata(type);
  const typeID = uuidv4();
  const insertStmt = "INSERT INTO eventTypes " +
                        "(typeID, typeMetadata, typeName) " + 
                     `VALUES("${typeID}", '${metadata}', "${type.typeName}");`;
  logger.log(insertStmt);
  let insert = await sequelize.query(insertStmt, {type: sequelize.QueryTypes.INSERT});
  return typeID;
}

async function deleteEventType(typeID){
  const delStmt = `DELETE FROM eventTypes WHERE typeID='${typeID}'`;
  let del = await sequelize.query(delStmt, {type: sequelize.QueryTypes.DELETE});
  return del;
}

async function updateEventType(id, type){
  logger.log(type);
  const md = utils.getEventMetadata(type);
  const query = 'UPDATE eventTypes ' +
                `SET typeName='${type.typeName}', typeMetadata='${md}' ` +
                `WHERE typeID='${id}';`;
  logger.log(query);
  let upd = await sequelize.query(query, {type: sequelize.QueryTypes.UPDATE});
  return upd;
}

async function queryAllRoles(){
  let roles = await sequelize.query("SELECT * FROM roles ORDER BY roles.grantInfo");
  return roles;
}

async function queryRoleByID(id){
  let role = await sequelize.query(`SELECT * FROM roles WHERE roleID='${id}'`);
  return role;
}

async function insertRole(role){
  const grantInfo = utils.getGrantInfoForDb(role);
  const query = `INSERT INTO roles (roleID, grantInfo) VALUES('${uuidv4()}', '${grantInfo}');`;
  return await sequelize.query(query);
}

async function deleteRole(id){
  return await sequelize.query(`DELETE FROM roles WHERE roleID='${id}'`);
}

async function updateRole(id, roleInfo){
  const grantInfo = utils.getGrantInfoForDb(roleInfo);
  const query = `UPDATE roles SET grantInfo='${grantInfo}' WHERE roleID='${id}';`;
  return await sequelize.query(query);
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
module.exports.queryAllRoles = queryAllRoles;
module.exports.queryRoleByID = queryRoleByID;
module.exports.queryAllEventNames = queryAllEventNames;
module.exports.runSelectionDefault = runSelectionDefault;
module.exports.runSelectionRandom = runSelectionRandom;
module.exports.getCapacityFromEventID = getCapacityFromEventID;
module.exports.queryParticipantsNotReady = queryParticipantsNotReady;
module.exports.queryEventStatusByID = queryEventStatusByID;
module.exports.changeParticipantStatus = changeParticipantStatus;
module.exports.resetParticipantsStatus = resetParticipantsStatus;
module.exports.selectAllParticipantStatus = selectAllParticipantStatus;
module.exports.queryParticipantsByParticpantAttr = queryParticipantsByParticpantAttr;
module.exports.editUser = editUser;
module.exports.insertRole = insertRole;
module.exports.updateRole = updateRole;
module.exports.deleteRole = deleteRole;
