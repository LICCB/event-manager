// initialize access control
const db = require('./database');
const AccessControl = require('accesscontrol');

// permissions variables
const resources = ['Events', 'Event Types', 'Participants', 'Users', 'Roles'];
const permissions = ['Create', 'Read', 'Update', 'Delete'];
const acPermissions = ['create:any', 'read:any', 'update:any', 'delete:any'];
const internalPermissions = ['"create:any":["*"]','"read:any":["*"]','"update:any":["*"]','"delete:any":["*"]'];

// permissions
const create = 'create';
const read = 'read';
const update = 'update';
const del = 'delete'; // delete is a reserved word

// resources
const events = 'Events';
const eventTypes = 'Event Types';
const participants = 'Participants';
const users = 'Users';
const roles = 'Roles';

async function getRolesFromDb(){
    var grants = await db.queryAllRoles();
    var roles = "{";
    var role = "";
    var numRoles = grants[0].length;
    for(i = 0; i < numRoles; i++){
        role = grants[0][i].grantInfo;
        role = role.slice(1, role.length-1);
        roles += role;
        if(i < numRoles-1){
            roles += ',';
        }
    }
    roles += "}";
    const ac = new AccessControl(JSON.parse(roles));
    return ac;
};

module.exports.resources = resources;
module.exports.permissions = permissions;
module.exports.acPermissions = acPermissions;
module.exports.getRolesFromDb = getRolesFromDb;
module.exports.internalPermissions = internalPermissions;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.del = del;
module.exports.events = events;
module.exports.eventTypes = eventTypes;
module.exports.participants = participants;
module.exports.users = users;
module.exports.roles = roles;