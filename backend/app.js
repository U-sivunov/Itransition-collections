const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const app = express();
const router = express.Router();

app.use(cors({
    origin: function (origin, callback) {
        if (/^https:\/\/itransition-collections$/.test(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Должно быть true, если вы используете HTTPS
        maxAge: 24 * 60 * 60 * 1000, // Срок действия cookie-файла - 1 день
        httpOnly: false,
        sameSite: 'none',
    },
    store: new MemoryStore(undefined)
}));

// passport
const authenticateUser = async (username, password, done) => {
    try {
        // Поиск пользователя по имени пользователя
        const user = await prisma.user.findUnique({where: {username}});
        if (!user) {
            return done(null, false, {message: 'Нет пользователя с таким именем.'});
        }

        // Сравнение хешированных паролей
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, {message: 'Неверный пароль.'});
        }

        // Пользователь найден и пароль совпадает
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}

passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({where: {id}});
        console.log('user');
        console.log(user);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.use(passport.initialize());
app.use(passport.session(undefined));
app.set('trust proxy', 1);

const prisma = new PrismaClient();

// Middleware для проверки аутентификации
function isAuthenticated(req, res, next) {
    console.log(req.session);
    console.log(req.user);
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(200).send('залогинься');
}

// Middleware для проверки прав администратора
function isAdmin(req, res, next) {
    if (req.user.isAdmin) {
        return next();
    }
    res.status(403).send('Access denied');
}

router.post('/api/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const salt = await bcrypt.genSalt(10,);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({data: { username: username, password: hashedPassword, email: email, isAdmin: true }});
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
            return res.json({ status: 'success', message: 'Logged in successfully', user });
        });
    })(req, res, next);
});

router.get('/api/logout', (req, res) => {
    req.logout();
    res.json({ status: 'success', message: 'Logged out successfully' });
});

router.get('/api/users', isAuthenticated, (req, res) => {
    if (req.user.isAdmin) {
        prisma.user.findMany().then(users => {
            res.json(users);
        }).catch(error => {
            res.status(500).send(error.message);
        });
    } else {
        res.json(req.user);
    }
});


app.use(router)
module.exports = app;

