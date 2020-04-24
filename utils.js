const logger = require('./logger');
const rbac = require('./rbac');
logger.module = 'utils';

/**
 * Returns the time in HH:MM from the JS Date object
 * @param {Date} time 
 */
function getTime(time) {
    var minutes = time.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }

    var hours = time.getHours().toString();
    if (hours.length == 1) {
        hours = "0" + hours;
    }
    return hours + ":" + minutes;
}

/**
 * Returns the datetime in YYYY-MM-DD HH:MM:SS
 */
function getDateTime() {
    var now = new Date();
    var year,month,day,hour,minute,second;
    year = now.getFullYear().toString();
    if(now.getMonth() + 1 < 10) {
        month = "0" + (now.getMonth() + 1).toString();
    } else {month = now.getMonth + 1};
    if(now.getDate() < 10) {
        day = "0" + now.getDate().toString();
    } else {day = now.getDate().toString();}
    hour = now.getHours().toString();
    minute = now.getMinutes().toString();
    second = now.getSeconds().toString();
    miliseconds = now.getMilliseconds().toString();

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "." + miliseconds;
};

/**
 * Returns the date in YYYY-MM-DD from the JS Date object
 * @param {Date} time 
 */
function getDate(time) {
    var month = (time.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + month;
    }

    var day = time.getDate().toString();
    if (day.length == 1) {
        day = "0" + day;
    }
    return time.getFullYear() + "-" + month + "-" + day;
}

/**
 * Returns the JSON representation of the dynamic event fields
 * @param {JSON} event 
 */
function getEventMetadata(event) {
    var md = '{';
    const keys = Object.keys(event);
    const vals = Object.values(event);
    for (i = 0; i < keys.length - 1; i++) {
        if (/\d/.test(keys[i])) {
            md += `"${vals[i]}"` + ' : ' + `"${vals[i+1]}"`;
            i++;
            if (i < keys.length - 1) {
                md += ",";
            }
        }
    }
    md += "}";
    logger.log(md);
    return JSON.stringify(JSON.parse(md));
}

function eventMetadataWrapper(signup, metadata) {
    var md = '{';
    metadata = JSON.parse(metadata);
    const extraFields = Object.keys(metadata);
    for (i = 0; i < extraFields.length; i++) {
        md += `"${extraFields[i]}": "${signup[extraFields[i]]}"`;
        if (i < extraFields.length - 1) {
            md += ",";
        }
    }
    md += "}";
    return JSON.stringify(JSON.parse(md));
}

function cleanupEventData(events){
    for(i = 0; i < events.length; i++){
        events[i].startTime = trimTime(events[i].startTime);
        events[i].endTime = trimTime(events[i].endTime);
        events[i]["Manager"] = `${events[i].firstName} ${events[i].lastName}`;
        delete events[i].firstName;
        delete events[i].lastName;
    }
    return events;
}

function trimTime(time){
    var timeStr = time.toString();
    const stop = timeStr.indexOf(":00 ");
    return timeStr.slice(0, stop);
}

function getResourcePermissions(res){
    if(res == undefined){return '';}
    var crud = '';
    var perms = rbac.acPermissions;
    var newPerms = rbac.permissions;
    for(var i=0;i<perms.length;i++){
        if(res[perms[i]]){
            if(crud.length > 0){crud += ', '};
            crud += newPerms[i];
        }
    }
    return crud;
}

function getPermissions(role){
    var permissions = [];
    var grantInfo = JSON.parse(role.grantInfo);
    var vals = (Object.values(grantInfo))[0];
    var resources = rbac.resources;
    for(var i=0;i<resources.length;i++){
        permissions.push(getResourcePermissions(vals[resources[i].replace(' ', '')]));
    }
    return permissions;
}

function getResourcePermissionsMatrix(res){
    if(res == undefined){return '';}
    var crud = [];
    var perms = rbac.acPermissions;
    for(var i=0;i<perms.length;i++){
        if(res[perms[i]]){
            crud.push(1);
        } else {
            crud.push(0);
        }
    }
    return crud;
}

function getPermissionsMatrix(role){
    var permissions = [];
    var grantInfo = JSON.parse(role.grantInfo);
    var vals = (Object.values(grantInfo))[0];
    var resources = rbac.resources;
    for(var i=0;i<resources.length;i++){
        permissions.push(getResourcePermissionsMatrix(vals[resources[i].replace(' ', '')]));
    }
    return permissions;
}

function getRoleName(role){
    return (Object.keys(JSON.parse(role.grantInfo)))[0];
}

function getGrantInfoForDb(role){
    const resources = rbac.resources;
    const permissions = rbac.permissions;
    const internal = rbac.internalPermissions;
    var json = `{ "${role.roleName}": {`;
    var resPerm = '';
    var permCount;
    for(var j = 0; j < resources.length; j++){ 
      permCount =0;
      json += `"${resources[j].replace(' ', '')}" : {`;
      for(var i = 0; i < permissions.length; i++){ 
        resPerm = (permissions[i] + resources[j]).replace(' ', '');
        if(role[resPerm].length != 1){
          if(permCount > 0){
            json += ', '
          }
          json += internal[i];
          permCount++;
        }
      }
      json += '}'; 
      if(j != resources.length - 1){
       json += ', ' 
      }
    }
    json += '}}'; 
    return JSON.stringify(JSON.parse(json));
}

module.exports.getTime = getTime;
module.exports.getDate = getDate;
module.exports.getEventMetadata = getEventMetadata;
module.exports.cleanupEventData = cleanupEventData;
module.exports.getDateTime = getDateTime;
module.exports.eventMetadataWrapper = eventMetadataWrapper;
module.exports.getPermissions = getPermissions;
module.exports.getRoleName = getRoleName;
module.exports.getGrantInfoForDb = getGrantInfoForDb;
module.exports.getPermissionsMatrix = getPermissionsMatrix;