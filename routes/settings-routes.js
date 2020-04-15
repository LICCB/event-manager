const router = require('express').Router();
const db = require('../database');
// const passport = require('passport');
const logger = require('../logger');
logger.module = 'settings-routes';

const authCheck = (req, res, next) => {
    if(!req.user){
        // if not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in
        next();
    }
};

router.get('/', authCheck, (req, res) => {
<<<<<<< HEAD
    res.render('settings/settings', {
      user: req.user,
      title: "Settings"
    });
});

router.get('/addUser', authCheck, (req, res) => {
    res.render('settings/addUser', {
      user: req.user,
      title: "Add User"
    });
});

router.post('/addUser', authCheck, async (req, res) => {
=======
    logger.log(req.user);
    res.render('settings/settings', {title: "Settings"});
});

router.get('/addUser', authCheck, (req, res) => {
    logger.log(req.user);
    res.render('settings/addUser', {title: "Add User"});
});

router.post('/addUser', authCheck, async (req, res) => {
    logger.log(req.user);
    logger.log(req.body);
>>>>>>> master
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

router.get('/disableUser/:id', authCheck, async (req, res) => {
    await db.disableUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/deleteUser/:id', authCheck, async (req, res) => {
    await db.deleteUser(req.params.id);
    res.redirect('/settings/users');
});

router.get('/users', authCheck, async (req, res) => {
<<<<<<< HEAD
    const users = await db.queryAllUsers();
    res.render('settings/users', {
      user: req.user,
      title: "All Users",
      users: users});
=======
    logger.log(req.user);
    const users = await db.queryAllUsers();
    logger.log(users);
    res.render('settings/users', {title: "All Users", users: users});
>>>>>>> master
});

router.get('/createEventType', authCheck, async (req, res) => {
    res.render("settings/createEventType", {
      user: req.user,
      title: "Creat Event Type"
    });
  });
  
  router.post('/createEventType', authCheck, async (req, res) => {
<<<<<<< HEAD
=======
    logger.log(req.body);
>>>>>>> master
    await db.insertEventType(req.body);
    res.redirect("/settings/eventTypes");
  });
  
  router.get('/eventTypes', authCheck, async (req, res) => {
<<<<<<< HEAD
    const eventTypes = await db.queryEventTypes();
=======
    const ets = await db.queryEventTypes();
    logger.log(ets);
>>>>>>> master
    res.render("settings/eventTypes", {
      user: req.user,
      title: "Event Types",
      types: eventTypes
    });
  });
  
  router.get('/editEventType/:id', authCheck, async (req, res) => {
    const type = await db.queryEventTypeByID(req.params.id);
<<<<<<< HEAD
=======
    logger.log(type);
    logger.log(type[0]);
>>>>>>> master
    res.render("settings/editEventType", {
      user: req.user,
      title: "Edit Event Type",
      type: type[0]
    });
  });
  
  router.post('/editEventType/:id', authCheck, async (req, res) => {
<<<<<<< HEAD
=======
    logger.log("REQ BODY", req.body);
>>>>>>> master
    await db.updateEventType(req.params.id, req.body);
    res.redirect('/settings/eventTypes');
  });
  
  router.get('/deleteEventType/:id', authCheck, async (req, res) => {
    await db.deleteEventType(req.params.id);
    res.redirect('/settings/eventTypes');
  });

module.exports = router;