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
    console.log(md);
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

module.exports.getTime = getTime;
module.exports.getDate = getDate;
module.exports.getEventMetadata = getEventMetadata;
module.exports.cleanupEventData = cleanupEventData;
module.exports.getDateTime = getDateTime;
