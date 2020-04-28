// initialize access control
const db = require('./database');
const AccessControl = require('accesscontrol');

// global permissions variables
var resources = ['Events', 'Event Types', 'Participants', 'Users'];
var permissions = ['Create', 'Read', 'Update', 'Delete'];
var acPermissions = ['create:any', 'read:any', 'update:any', 'delete:any'];
const internalPermissions = ['"create:any":["*"]','"read:any":["*"]','"update:any":["*"]','"delete:any":["*"]'];


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