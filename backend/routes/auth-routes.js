const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models');

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.create({ username, password, email });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/t', (req, res) => {
    res.send('<h1>TTTTTTT</h1>');
});

module.exports = router;
