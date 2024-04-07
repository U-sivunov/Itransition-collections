const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const cors = require('cors');
const { PrismaClient, Role, CollectionTypeEnum} = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

const session = require('express-session');
const app = express();
const router = express.Router();
const prisma = new PrismaClient();

app.use(cors({
    origin: function (origin, callback) {
        if (/^https:\/\/itransition-collections-.*-u-sivunovs-projects\.vercel\.app$/.test(origin) || 'https://itransition-collections-one.vercel.app' === origin || !origin) {
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
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: 'none',
    },
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));

const authenticateUser = async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({where: {username}});
        if (!user) {
            return done(null, false, {message: 'Нет пользователя с таким именем.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, {message: 'Неверный пароль.'});
        }

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
        done(null, user);
    } catch (error) {
        done(error);
    }
});

app.use(passport.initialize());
app.use(passport.session(undefined));
app.set('trust proxy', 1);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(403).send('залогинься');
    }

}

async function canAdd(req, res, next) {
    const user = req.user;
    const collection = await prisma.collection.findUnique({where: {id:  req.body.collectionId}});
    console.log(user)
    console.log(collection)
    if (collection.authorId === user.id || req.user?.role === Role.ADMIN) {
        return next();
    } else {
        res.status(403).send('неположено');
    }

}

async function canUpdateItem(req, res, next) {
    const user = req.user;
    if (req.body.data.authorId === user.id || req.user?.role === Role.ADMIN) {
        return next();
    } else {
        res.status(403).send('неположено');
    }
}

async function canDeleteItem(req, res, next) {
    const user = req.user;
    if (req.body.authorId === user.id || req.user?.role === Role.ADMIN) {
        return next();
    } else {
        res.status(403).send('неположено');
    }

}

function isAdmin(req, res, next) {
    if (req.user?.role === Role.ADMIN) {
        return next();
    } else {
        res.status(403).send('Access denied');
    }

}

router.get('/api/getAuthUser', async (req, res) => {
    res.json(req.user);
});

router.post('/api/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const salt = await bcrypt.genSalt(10,);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({data: { username: username, password: hashedPassword, email: email, role: Role.ADMIN}});
        res.json(user);
    } catch (error) {
        res.status(200).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
    res.send();
});

router.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
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

router.post('/api/admin', isAdmin, async (req, res) => {
    try {
        const user = await prisma.user.update({where: {id: req.body.id}, data: {role: Role.ADMIN}});
        res.json(user);
    } catch (error) {
        res.status(200).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.post('/api/unadmin', isAdmin, async (req, res) => {
    try {
        const user = await prisma.user.update({where: {id: req.body.id}, data: {role: Role.USER}});
        res.json(user);
    } catch (error) {
        res.status(200).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.post('/api/delete-user', isAdmin, async (req, res) => {
    try {
        const user = await prisma.user.delegatesFocus({where: {id: req.body.id}});
        res.json(user);
    } catch (error) {
        res.status(200).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).send();
    });
});

router.get('/api/users', isAuthenticated, (req, res) => {
    if (req.user?.role === Role.ADMIN) {
        prisma.user.findMany().then(users => {
            res.json(users);
        }).catch(error => {
            res.status(500).send(error.message);
        });
    } else {
        res.json(req.user);
    }
});

router.get('/api/collectionTypes', (req, res) => {
    res.json(Object.values(CollectionTypeEnum));
});

router.post('/api/collection', isAuthenticated, async (req, res, next) => {
    try {
        const data = req.body;
        data.author = {connect: {id: req.user.id}};

        const types = ['string','text','boolean','number','date'];

        types.forEach((t) => {
            data[t+'FieldNames'] = {
                create: data[t+'FieldNames'].map(name => {
                    return {name: name};
                })
            }
        })

        const collection = await prisma.collection.create({data: data});
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.post('/api/update-collection', isAuthenticated, async (req, res, next) => {
    try {
        const data = req.body;
        data.author = {connect: {id: req.user.id}};
        const collection = await prisma.collection.create({data: data});
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/my-collections', isAuthenticated, async (req, res, next) => {
    try {
        const collection = await prisma.collection.findMany({
            where: {authorId: req.user.id},
            include: {
                _count: {
                    select: { items: true },
                },
            },
        });
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/all-collections', isAuthenticated, async (req, res, next) => {
    try {
        const collection = await prisma.collection.findMany({
            include: {
                _count: {
                    select: { items: true },
                },
            },
        });
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});




router.get('/api/collections/:id', async (req, res, next) => {
    try {
        const collection = await prisma.collection.findUnique({where: {id: parseInt(req.params.id)},
            include: {
                stringFieldNames: true,
                textFieldNames: true,
                booleanFieldNames: true,
                numberFieldNames: true,
                dateFieldNames: true,
                _count: { select: {items: true}}
        }
        });
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.post('/api/item', isAuthenticated, canAdd, async (req, res, next) => {
    try {
        const data = req.body;
        data.author = {connect: {id: req.user.id}};
        data.collection = {connect: {id: req.body.collectionId}};
        data.tags = {create: data.tags};
        delete data.collectionId;
        console.log(data);
        const item = await prisma.item.create({data: data});
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.post('/api/update-item', isAuthenticated, canUpdateItem, async (req, res, next) => {
    try {
        // const newTags = req.body.data.tags.map(t => {return {name: t}});
        // const nt = await prisma.itemTag.createMany({data: newTags, skipDuplicates: true});
        const updateRequest = req.body;
        delete updateRequest.data.authorId;
        console.log(updateRequest);
        const item = await prisma.item.update(updateRequest);
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.post('/api/delete-item', isAuthenticated, canDeleteItem, async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data)
        const delete1 = prisma.itemStringValues.deleteMany({where: { itemId: data.id}});
        const delete2 = prisma.itemTextValues.deleteMany({where: { itemId: data.id}});
        const delete3 = prisma.itemBooleanValues.deleteMany({where: { itemId: data.id}});
        const delete4 = prisma.itemNumberValues.deleteMany({where: { itemId: data.id}});
        const delete5 = prisma.itemDateValues.deleteMany({where: { itemId: data.id}});

        const deleteItem = prisma.item.delete({where: {id: data.id}});

        const transaction = await prisma.$transaction([delete1, delete2, delete3, delete4, delete5, deleteItem])
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/item/:id', async (req, res, next) => {
    try {
        const item = await prisma.item.findUnique({where: {id: parseInt(req.params.id)},
            include: {
                collection: true,
                stringFieldValues: {
                    include: {
                        name: true,
                    },
                },
                textFieldValues: {
                    include: {
                        name: true,
                    },
                },
                booleanFieldValues: {
                    include: {
                        name: true,
                    },
                },
                numberFieldValues: {
                    include: {
                        name: true,
                    },
                },
                dateFieldValues: {
                    include: {
                        name: true,
                    },
                },
                tags: true,
            }});
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/get-resent-items', async (req, res, next) => {
    try {
        const items = await prisma.item.findMany({where: {published: true}, orderBy: {id: 'desc'}, take: 5});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/get-biggest-collections', async (req, res, next) => {
    try {
        const items = await prisma.collection.findMany({take: 5, orderBy: {items: {_count: 'desc'}}});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/items-by-collection/:id', async (req, res, next) => {
    try {
        const items = await prisma.item.findMany({where: {collectionId: parseInt(req.params.id)}, include: {tags: true}});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/tags', async (req, res, next) => {
    try {
        const tags = await prisma.itemTag.findMany();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/tagsForCloud', async (req, res, next) => {
    try {
        const tags = await prisma.itemTag.findMany({include: {_count: {select: {items: true}}}});
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

router.get('/api/search/:str', async (req, res, next) => {
    const conditionArray = [
        {title: {search: req.params.str}},
        {stringFieldValues: {some: {
                    value: { search: req.params.str }
                }}},
        {textFieldValues: {some: {
                    value: { search: req.params.str }
                }}},
        {tags: {some: {
                    name: req.params.str
                }}}
    ];
    if (parseInt(req.params.str) || parseInt(req.params.str) === 0) {
        conditionArray.push(
            {numberFieldValues:
                {some: {
                    value:  parseInt(req.params.str)
            }}})
    }
    try {
        const items = await prisma.item.findMany({
            where: {OR: conditionArray}
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - ' + error, code: error.code, meta: error.meta});
    }
});

app.use(router)
module.exports = app;

