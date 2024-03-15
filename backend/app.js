const express = require('express');
const passport = require('passport');

const session = require('express-session');
const initializePassport = require('./passport-config');
// const authRoutes = require('./routes/auth-routes');
const { Sequelize } = require('sequelize');
const app = express();
const env = process.env.NODE_ENV1 || 'development';
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
console.log(env);
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
const router = express.Router();
const config = require(__dirname + '/config/config.json')[env];
const bcrypt = require('bcrypt');
// Ваша конфигурация и middleware для Express.js



// const sequelize = new Sequelize(config.database, config.username, config.password, config,);
const sequelize = new Sequelize("postgres://default:9zmItEg8UaPb@ep-weathered-sun-a4rcuabw.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require", config);


sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = require('./models/user')(sequelize, Sequelize);

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
// app.use(authRoutes);

// Передаем функции для получения пользователя по имени и ID в initializePassport
initializePassport(
    passport,
    username => User.findOne({ where: { username } }),
    id => User.findByPk(id)
);


app.get('/api/test', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`<h1>Hello ${req.user.username}</h1><a href="/logout">Logout</a>`);
    } else {
        res.send('<h1>Welcome to the main page. <a href="/login">Login</a></h1>');
    }
});

app.post('/api/loging', (req, res) => {
    passport.authenticate('local', {
        failureFlash: true,
    });
});

router.post('/api/registering', async (req, res) => {
    console.log('8888');
    try {
        const username = req.body[0];
        const password = req.body[1];
        const email = req.body[2];
        console.log(req.body);
        console.log(password);
        debugger
        // Генерация соли
        const salt = await bcrypt.genSalt(10,);

        // Хэширование пароля с использованием соли
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание пользователя с хэшированным паролем
        const user = await User.create({ username, password: hashedPassword, email });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error777' });
    }
    res.send();
});

// app.post('api/login', (req, res) => {
//     passport.authenticate('local', {
//         successRedirect: '/44444',
//         failureRedirect: '/login55',
//         failureFlash: true,
//     });
// });

function lgut() {
    console.log("HHHHHh")
}

app.get('/api/logout', (req, res) => {
    req.logout(lgut);
    res.redirect('/');
});

// router.post('/api/register', async (req, res) => {
//     try {
//         const { username, password, email } = req.body;
//         const user = await User.create({ username, password, email });
//         res.json(user);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


app.use(router)
module.exports = app;

