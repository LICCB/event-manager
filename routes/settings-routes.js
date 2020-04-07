const router = require('express').Router();
const db = require('../database');
// const passport = require('passport');

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
    console.log(req.user);
    res.render('settings/settings', {
      user: req.user,
      title: "Settings"
    });
});

router.get('/addUser', authCheck, (req, res) => {
    console.log(req.user);
    res.render('settings/addUser', {
      user: req.user,
      title: "Add User"
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
      users: users});
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

module.exports = router;