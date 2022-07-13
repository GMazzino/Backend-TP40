import { Router } from 'express';
import passport from '../models/passport_local.js';
import { isAuth } from '../midwares/auth.js';
import upload from '../midwares/file_uploader.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', isAuth, (req, res) => {
  res.render('index', {
    name: req.user.name,
    avatar: req.user.avatar,
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: '/login',
    successRedirect: '/',
  })
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post(
  '/register',
  upload.single('avatar'),
  passport.authenticate('register', {
    failureRedirect: '/register',
    successRedirect: '/',
  })
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
