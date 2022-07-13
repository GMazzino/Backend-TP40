import session from 'express-session';
import MongoStore from 'connect-mongo';
import { mongoRemote, SESSION_SECRET } from '../../config.js';

export default session({
  store: MongoStore.create({
    mongoUrl: mongoRemote.url,
    mongoOptions: mongoRemote.advancedOptions,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: 'gmazzinoEcommerce',
  cookie: {
    maxAge: 10 * 60 * 1000,
    secure: false,
  },
});
