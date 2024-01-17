const User = require('../models/user');
const express = require("express");
const passport = require('passport');
const router = express.Router();
const LocalStrategy = require('passport-local').Strategy;

const verify = async (username, password, done) => {
    try {
        const user = await User.findOne({ username, password });
        if (!user) { return done(null, false, { message: 'Incorrect username or password' }) }
        return done(null, user);
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
};

const options = {
    usernameField: "username",
    passwordField: "password",
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
    cb(null, user.id)
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await User.findById(id);
        console.log(user)
        cb(null, user);
    } catch (err) {
        cb(err);
    }

});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/user/me',
    failureRedirect: '/api/user/login'
}));

router.get('/login', (req, res) => {
    res.render('authorization/login', { title: 'Авторизация:' });
});

router.get('/me', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/api/user/login')
    }
    next()
}, (req, res) => {
    console.log(req.user._id)
    res.render('authorization/profile', { title: 'Профиль:', user: req.user });
});

router.get('/signup', (req, res) => {
    res.render('authorization/signup', { title: 'Регистрация:' });
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const newUser = new User({ username, password });
        await newUser.save()
        res.redirect('/api/user/login');
    } catch (err) {
        res.status(500).json(`Internal Server Error ${err}`);
    }

});


module.exports = router;