const router = require('express').Router();
const db = require('../database');
const logger = require('../logger');
const utils = require('../utils');
const rbac = require('../rbac');

const authCheck = (req, res, next) => {
  if(!req.user && process.env.LICCB_MODE != 'testing'){
      // if not logged in
      res.redirect('/auth/google');
  } else {
      // if logged in
      next();
  }
};

const permCheck = function (resource, func) {
  return async function(req, res, next) {
    if (process.env.LICCB_MODE != 'testing') {
      const grantInfo = ((await db.queryRoleByID(req.user.roleID))[0][0]).grantInfo;
      const role = (Object.keys(JSON.parse(grantInfo)))[0];
      var perm = {granted : false};
      var ac = await rbac.getRolesFromDb();
      switch(func) {
        case 'create':
          perm = ac.can(role).createAny(resource);
          break;
        case 'read':
          perm = ac.can(role).readAny(resource);
          break;   
        case 'update':
          perm = ac.can(role).updateAny(resource);
          break;
        case 'delete':
          perm = ac.can(role).deleteAny(resource);
          break;
        default:
          break;
      }
      if(perm.granted){
        logger.log(`${req.user.firstName} ${req.user.lastName} was granted access to ${resource} for ${func}`)
        next();
      }
      else{
        logger.log(`${req.user.firstName} ${req.user.lastName} was denied access to ${resource} for ${func}`)
        res.redirect('/unauthorized');
      }
    } else {
      next();
    }
  }
}

router.get('/', authCheck, (req, res) => {
    res.render('settings/settings', {
      user: req.user,
      title: "Settings"
    });
});

router.get('/addUser', authCheck, permCheck(rbac.users, rbac.create), async (req, res) => {
  res.render('settings/addUser', {
    user: req.user,
    title: "Add User",
    roles: (await db.queryAllRoles())[0],
    utils: utils
  });
});

router.post('/addUser', authCheck, permCheck(rbac.users, rbac.create), async (req, res) => {
    await db.insertUser(req.body.email, req.body.fname, req.body.lname);
    res.redirect('/settings/users');
});

router.get('/deleteUser/:id', authCheck, permCheck(rbac.users, rbac.del), async (req, res) => {
    await db.deleteUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/enableUser/:id', authCheck, permCheck(rbac.users, rbac.update), async (req, res) => {
    await db.enableUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/editUser/:id', authCheck, permCheck(rbac.users, rbac.update), async (req, res) => {
  res.render('settings/editUser', {
    title: "Edit User",
    user: req.user,
    editUser: (await db.queryUserByID(req.params.id))[0],
    roles: (await db.queryAllRoles())[0],
    utils: utils
  });
});

router.post('/editUser/:id', authCheck, permCheck(rbac.users, rbac.update), async (req, res) => {
  const u = req.body;
  await db.editUser(req.params.id, u.email, u.fname, u.lname, u.roleID);
  res.redirect('/settings/users');
});

router.get('/disableUser/:id', authCheck, permCheck(rbac.users, rbac.update), async (req, res) => {
  await db.disableUser(req.params.id);
  res.redirect('/settings/users');
});

router.get('/deleteUser/:id', authCheck, permCheck(rbac.users, rbac.update), async (req, res) => {
    await db.deleteUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/users', authCheck, permCheck(rbac.users, rbac.read), async (req, res) => {
    const users = await db.queryAllUsers();
    res.render('settings/users', {
      user: req.user,
      title: "All Users",
      users: users,
      utils: utils
    });
});

router.get('/createEventType', authCheck, permCheck(rbac.eventTypes, rbac.create),async (req, res) => {
    res.render("settings/createEventType", {
      user: req.user,
      title: "Creat Event Type"
    });
  });
  
router.post('/createEventType', authCheck, permCheck(rbac.eventTypes, rbac.create), async (req, res) => {
  await db.insertEventType(req.body);
  res.redirect("/settings/eventTypes");
});

router.get('/eventTypes', authCheck, permCheck(rbac.eventTypes, rbac.read), async (req, res) => {
  const eventTypes = await db.queryEventTypes();
  res.render("settings/eventTypes", {
    user: req.user,
    title: "Event Types",
    types: eventTypes
  });
});

router.get('/editEventType/:id', authCheck, permCheck(rbac.eventTypes, rbac.update), async (req, res) => {
  const type = await db.queryEventTypeByID(req.params.id);
  res.render("settings/editEventType", {
    user: req.user,
    title: "Edit Event Type",
    type: type[0]
  });
});
  
router.post('/editEventType/:id', authCheck, permCheck(rbac.eventTypes, rbac.update), async (req, res) => {
  await db.updateEventType(req.params.id, req.body);
  res.redirect('/settings/eventTypes');
});

router.get('/deleteEventType/:id', authCheck, permCheck(rbac.eventTypes, rbac.del), async (req, res) => {
  await db.deleteEventType(req.params.id);
  res.redirect('/settings/eventTypes');
});

router.get('/createRole', authCheck, permCheck(rbac.roles, rbac.create), async (req, res) => {
  res.render('settings/createRole', {
    user: req.user,
    title: 'Create Role',
    resources: rbac.resources,
    permissions: rbac.permissions
  });
});

router.post('/createRole', authCheck, permCheck(rbac.roles, rbac.create), async (req, res) => {
  await db.insertRole(req.body);
  res.redirect('/settings/roles');
});

router.get('/roles', authCheck, permCheck(rbac.roles, rbac.read), async (req, res) => {
  res.render('settings/roles', {
    user: req.user,
    title: 'Roles',
    resources: rbac.resources,
    roles: (await db.queryAllRoles())[0],
    utils: utils
  });
});

router.get('/deleteRole/:id', authCheck, permCheck(rbac.roles, rbac.del), async (req, res) => {
  await db.deleteRole(req.params.id);
  res.redirect('/settings/roles');
});

router.get('/editRole/:id', authCheck, permCheck(rbac.roles, rbac.update), async (req, res) => {
  const role = (await db.queryRoleByID(req.params.id))[0][0];
  const permissions = utils.getPermissionsMatrix(role);
  res.render('settings/editRole', {
    title: 'Edit Role',
    user: req.user,
    role: role,
    resources: rbac.resources,
    permissions: rbac.permissions,
    granted: permissions,
    utils: utils
  });
});

router.post('/editRole/:id', authCheck, permCheck(rbac.roles, rbac.update), async (req, res) => {
  await db.updateRole(req.params.id, req.body);
  res.redirect('/settings/roles');
});

module.exports = router;