const uuidv4 = require('uuid/v4');

// var Event = function(ename, mname, cap, psize, ptype, stime, etime, slevel, dist, sratio, cid, notes) {
//     this.id = uuidv4();
//     this.name = ename;
//     this.manager = mname;
//     this.capactity = cap;
//     this.maxPartySize = psize;
//     this.private = ptype;
//     this.startTime = stime;
//     this.startDate = sdate;
//     this.endTime = etime;
//     this.endDate = edate;
//     this.skillLevel = slevel;
//     this.distance = dist;
//     this.staffRatio = sratio;
//     this.creatorID = cid;
//     this.notes = notes;
// }
var Event = function(event) {
    this.id = uuidv4();
    this.name = event.ename;
    this.manager = event.mname;
    this.capactity = event.cap;
    this.maxPartySize = event.psize;
    this.private = event.ptype;
    this.startTime = event.stime;
    this.startDate = event.sdate;
    this.endTime = event.etime;
    this.endDate = event.edate;
    this.skillLevel = event.slevel;
    this.distance = event.dist;
    this.staffRatio = event.sratio;
    this.creatorID = event.cid;
    this.notes = event.notes;
}

Event.prototype.getInsertStatement = function() {
    console.log(this.id);
};


// var test = new Event('Test', 'David', 12, 12, 'public', "12:00", "3:00", "novice", 12, 2, 1);
// test.getInsertStatement();
// console.log(test);