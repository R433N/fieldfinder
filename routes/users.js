const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    // Accept either flat body { username, email, password } or nested { user: { ... } }
    const payload = req.body && req.body.user ? req.body.user : req.body;
    const { email, username, password } = payload;
    if (!username || !password) {
        req.flash('error', 'Username and password are required');
        return res.redirect('/register');
    }
    try {
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err)
        req.flash('success', 'Welcome to FieldFinder!');
        res.redirect('/fields');
    })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
    req.flash('success', 'Welcome Back!');
    res.redirect('/fields');
})

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success', 'Goodbye!');
    res.redirect('/fields');
  });
});

module.exports = router;