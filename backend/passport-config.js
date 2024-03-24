


const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function initialize(passport, getUserByUsername, getUserById) {
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
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    app.use(passport.initialize());
    app.use(passport.session(undefined));
}

module.exports = initialize;