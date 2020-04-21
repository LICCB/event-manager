// initialize access control
const db = require('./database');
const AccessControl = require('accesscontrol');

async function getRolesFromDb(){
    var grants = await db.queryAllRoles();
    var roles = "{";
    var role = "";
    var numRoles = grants[0].length;
    for(i = 0; i < numRoles; i++){
        role = grants[0][i].grantInfo;
        role = role.slice(1, role.length-1);
        console.log(role);
        roles += role;
        if(i < numRoles-1){
            roles += ',';
        }
    }
    roles += "}";
    const ac = new AccessControl(JSON.parse(roles));
    // console.log(ac.getGrants());
    const permission = ac.can('Admin').readAny('events');
    return ac;
};

module.exports.getRolesFromDb = getRolesFromDb;
