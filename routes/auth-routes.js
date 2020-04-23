const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('auth/login', {title: "Login"});
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: '/login'
}));

// callback route for google
router.get('/google/redirect', passport.authenticate('google', {failureRedirect: '/loginFailed'}), (req, res) => {
    res.redirect('/events');
});

module.exports = router;