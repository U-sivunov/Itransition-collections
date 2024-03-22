const express = require('express');
const passport = require('passport');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const session = require('express-session');
const initializePassport = require('./passport-config');
const app = express();
const router = express.Router();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session(undefined));

initializePassport(
    passport,
    username => prisma.user.findUnique({ where: { username } }),
    id => prisma.user.findUnique({ where: { id } })
);

const prisma = new PrismaClient();

router.get('/test', (req, res) => {
    console.log('test');
    if (req.isAuthenticated()) {
        res.send(`<h1>1111111Hello</h1><a href="/logout">Logout</a>`);
    } else {
        res.send('<h1>11111111Welcome to the main page. <a href="/login">Login</a></h1>');
    }
});

router.get('/api/au', (req, res) => {
    res.send(req.isAuthenticated().toString());
    // ещё нужно добавить информацию о наличии прав админа
});

// Middleware для проверки аутентификации
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Если пользователь не аутентифицирован, перенаправляем на домашнюю страницу
    // res.redirect('/');
    res.status(200).send('залогинься');
}

// Middleware для проверки прав администратора
function isAdmin(req, res, next) {
    if (req.user.isAdmin) {
        return next();
    }
    // Если пользователь не администратор, отправляем статус 403 (запрещено)
    res.status(403).send('Access denied');
}

router.post('/api/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        // Генерация соли
        const salt = await bcrypt.genSalt(10,);

        // Хэширование пароля с использованием соли
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание пользователя с хэшированным паролем
        const user = await prisma.user.create({data: { username: username, password: hashedPassword, email: email }});
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(200).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
    res.send();
});

router.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(user);
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.json({ status: 'success', message: 'Logged in successfully' });
        });
    })(req, res, next);
});

router.get('/api/logout', (req, res) => {
    req.logout();
    res.json({ status: 'success', message: 'Logged out successfully' });
});

router.get('/api/users', isAuthenticated, (req, res) => {
    if (req.user.isAdmin) {
        // Если пользователь администратор, возвращаем информацию обо всех пользователях
        prisma.user.findMany().then(users => {
            res.json(users);
        }).catch(error => {
            res.status(500).send(error.message);
        });
    } else {
        // Если пользователь не администратор, возвращаем информацию только о нем
        res.json(req.user);
    }
});


app.use(router)
module.exports = app;

