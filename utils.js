/**
 * Gets the time in HH:MM from the JS Date object
 * @param {Date} time 
 */
function getTime(time) {
    var minutes = time.getMinutes().toString();
    if(minutes.length == 1){
        minutes = "0" + minutes;
    }
    return time.getHours() + ":" + minutes;
}

// const d1 = new Date("2020-07-04T16:00:00.000Z");
// const d2 = new Date("2020-07-04T16:30:00.000Z");
// const d3 = new Date("2020-07-04T16:05:00.000Z");
// console.log(getTime(d1));
// console.log(getTime(d2));
// console.log(getTime(d3));
module.exports.getTime = getTime;