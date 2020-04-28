const router = require('express').Router();
const db = require('../database');
const logger = require('../logger');
const utils = require('../utils');
const rbac = require('../rbac');
logger.module = 'settings-routes';

const authCheck = (req, res, next) => {
  if(!req.user && process.env.LICCB_MODE != 'testing'){
      // if not logged in
      res.redirect('/auth/google');
  } else {
      // if logged in
      next();
  }
};

router.get('/', authCheck, (req, res) => {
    res.render('settings/settings', {
      user: req.user,
      title: "Settings"
    });
});

router.get('/addUser', authCheck, async (req, res) => {
  res.render('settings/addUser', {
    user: req.user,
    title: "Add User",
    roles: (await db.queryAllRoles())[0],
    utils: utils
  });
});

router.post('/addUser', authCheck, async (req, res) => {
    await db.insertUser(req.body.email, req.body.fname, req.body.lname);
    res.redirect('/settings/users');
});

router.get('/deleteUser/:id', authCheck, async (req, res) => {
    await db.deleteUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/enableUser/:id', authCheck, async (req, res) => {
    await db.enableUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/editUser/:id', authCheck, async (req, res) => {
  res.render('settings/editUser', {
    title: "Edit User",
    user: req.user,
    editUser: (await db.queryUserByID(req.params.id))[0],
    roles: (await db.queryAllRoles())[0],
    utils: utils
  });
});

router.post('/editUser/:id', authCheck, async (req, res) => {
  const u = req.body;
  await db.editUser(req.params.id, u.email, u.fname, u.lname, u.roleID);
  res.redirect('/settings/users');
});

router.get('/disableUser/:id', authCheck, async (req, res) => {
  await db.disableUser(req.params.id);
  res.redirect('/settings/users');
});

router.get('/deleteUser/:id', authCheck, async (req, res) => {
    await db.deleteUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/users', authCheck, async (req, res) => {
    const users = await db.queryAllUsers();
    res.render('settings/users', {
      user: req.user,
      title: "All Users",
      users: users,
      utils: utils
    });
});

router.get('/createEventType', authCheck, async (req, res) => {
    res.render("settings/createEventType", {
      user: req.user,
      title: "Creat Event Type"
    });
  });
  
router.post('/createEventType', authCheck, async (req, res) => {
  await db.insertEventType(req.body);
  res.redirect("/settings/eventTypes");
});

router.get('/eventTypes', authCheck, async (req, res) => {
  const eventTypes = await db.queryEventTypes();
  res.render("settings/eventTypes", {
    user: req.user,
    title: "Event Types",
    types: eventTypes
  });
});

router.get('/editEventType/:id', authCheck, async (req, res) => {
  const type = await db.queryEventTypeByID(req.params.id);
  res.render("settings/editEventType", {
    user: req.user,
    title: "Edit Event Type",
    type: type[0]
  });
});
  
router.post('/editEventType/:id', authCheck, async (req, res) => {
  await db.updateEventType(req.params.id, req.body);
  res.redirect('/settings/eventTypes');
});

router.get('/deleteEventType/:id', authCheck, async (req, res) => {
  await db.deleteEventType(req.params.id);
  res.redirect('/settings/eventTypes');
});

router.get('/createRole', authCheck, async (req, res) => {
  res.render('settings/createRole', {
    user: req.user,
    title: 'Create Role',
    resources: rbac.resources,
    permissions: rbac.permissions
  });
});

router.post('/createRole', authCheck, async (req, res) => {
  await db.insertRole(req.body);
  res.redirect('/settings/roles');
});

router.get('/roles', authCheck, async (req, res) => {
  res.render('settings/roles', {
    user: req.user,
    title: 'Roles',
    roles: (await db.queryAllRoles())[0],
    utils: utils
  });
});

router.get('/deleteRole/:id', authCheck, async (req, res) => {
  await db.deleteRole(req.params.id);
  res.redirect('/settings/roles');
});

router.get('/editRole/:id', authCheck, async (req, res) => {
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

router.post('/editRole/:id', authCheck, async (req, res) => {
  await db.updateRole(req.params.id, req.body);
  res.redirect('/settings/roles');
});

module.exports = router;