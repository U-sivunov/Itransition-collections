const express = require('express');
const passport = require('passport');
const session = require('express-session');
const initializePassport = require('./passport-config');
const authRoutes = require('./routes/auth-routes');
const { Sequelize } = require('sequelize');
const app = express();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];


const sequelize = new Sequelize(config.database, config.username, config.password, config);


sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = require('./models/User')(sequelize, Sequelize);

sequelize.sync()
    .then(() => {
        console.log('Models have been synchronized with the database.');
    })
    .catch(err => {
        console.error('Unable to synchronize models with the database:', err);
    });

// Ваша конфигурация и middleware для Express.js
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session(undefined));
app.use(authRoutes);

// Передаем функции для получения пользователя по имени и ID в initializePassport
initializePassport(
    passport,
    username => User.findOne({ where: { username } }),
    id => User.findByPk(id)
);

app.get('/test', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`<h1>Hello ${req.user.username}</h1><a href="/auth/logout">Logout</a>`);
    } else {
        res.send('<h1>Welcome to the main page. <a href="/auth/login">Login</a></h1>');
    }
});

module.exports = app;

