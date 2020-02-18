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
    return JSON.stringify(JSON.parse(md));
}

function filterEventData(events){
    for(i = 0; i < events.length; i++){
        // delete events[i].eventID;
        delete events[i].creatorID;
        delete events[i].eventMetadata;
        delete events[i].maxPartySize;
        delete events[i].capacity;
        delete events[i].staffRatio;
        events[i].startTime = trimTime(events[i].startTime);
        events[i].endTime = trimTime(events[i].endTime);
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
module.exports.filterEventData = filterEventData;