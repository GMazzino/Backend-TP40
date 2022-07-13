import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { user } from '../dao/mongoDB_users.js';
import { hashDehash } from '../utils/pwd_hash.js';
import logger from '../utils/logger.js';
import sendMail from '../utils/mailer.js';

passport.use(
  'register',
  new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    const newUser = req.body;
    try {
      newUser.avatar =
        username.replace(/\./g, '') + req.file.originalname.slice(req.file.originalname.lastIndexOf('.'));
    } catch {
      newUser.avatar = 'avatar.jpg';
    }
    try {
      await user.addUser(newUser, password);
      const createdUser = await user.findByUserId(username);
      sendMail(createdUser, 'user');
      return done(null, createdUser);
    } catch (err) {
      logger.error(`Module: models/passport_locals.js Method: passport_register -> ${err}`);
      return done(null, false);
    }
  })
);

passport.use(
  'login',
  new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    let foundUser;
    let pwdOk = false;
    try {
      foundUser = await user.findByUserId(username);
      if (foundUser?.pwdHash) {
        pwdOk = await hashDehash({
          pwd: password,
          pwdHash: foundUser.pwdHash,
          op: 'dehash',
        });
      }
    } catch (err) {
      logger.error(`Module: models/passport_local.js Method: passport_login -> ${err}`);
      req.session.messages = [];
      return done(null, false, { message: err.message });
    }
    if (pwdOk) {
      return done(null, foundUser);
    } else {
      req.session.messages = [];
      return done(null, false, {
        message: 'Usuario o password incorrectos',
      });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
