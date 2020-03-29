const router = require('express').Router();
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
    res.render('auth/profile', {user: req.user});
});

module.exports = router;