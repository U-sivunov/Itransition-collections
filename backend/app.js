const express = require('express');
const passport = require('passport');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const session = require('express-session');
const initializePassport = require('./passport-config');
// const authRoutes = require('./routes/auth-routes');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');


// Ваша конфигурация и middleware для Express.js
app.use(cors());
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

const prisma = new PrismaClient()

async function main() {
    // const user = await prisma.user.create({
    //     data: {
    //         name: 'Alice',
    //         email: 'alice@prisma.io',
    //     },
    // })
    // console.log(user)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/test/', (req, res) => {
    console.log('test');
    if (req.isAuthenticated()) {
        res.send(`<h1>1111111Hello</h1><a href="/logout">Logout</a>`);
    } else {
        res.send('<h1>11111111Welcome to the main page. <a href="/login">Login</a></h1>');
    }
});

router.post('/api/login', (req, res) => {
    passport.authenticate('local', {
        failureFlash: true,
    });
});

router.get('/api/test', (req, res) => {
    console.log('api/test');
    res.send(`<h1>222222Hello</h1><a href="/logout">Logout</a>`);
});

router.post('/api/register', async (req, res) => {
    console.log('8888');
    try {
        const username = req.body.username;
        const password = req.body.password[1];
        const email = req.body.email[2];
        console.log(req.body);
        console.log(password);
        console.log(username);
        debugger
        // Генерация соли
        const salt = await bcrypt.genSalt(10,);

        // Хэширование пароля с использованием соли
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание пользователя с хэшированным паролем
        const user = await prisma.user.create({ name: username, password: hashedPassword, email: email });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error - ' + error });
    }
    res.send();
});

router.post('api/login', (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/44444',
        failureRedirect: '/login55',
        failureFlash: true,
    });
});

router.get('/api/logout', (req, res) => {
    req.logout(lgut);
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

app.use((req, res, next) => {
    console.log(`Received a ${req.method} request to ${req.url}`);
    next();
});


app.use(router)
module.exports = app;

