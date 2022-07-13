export function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(400).redirect('/login');
  }
}
