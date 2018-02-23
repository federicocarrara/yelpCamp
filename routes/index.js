var express = require("express"),
    router = express.Router(),
    User = require('../models/user'),
    passport = require('passport');

router.get("/", (req, res) => {
  res.render("landing");
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  var newUser = new User ({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      req.flash('success', 'Welcome ' + user.username);
      passport.authenticate('local')(req, res, () => {
        res.redirect('/campgrounds');
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), (req, res) => {
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are succesfully logged out')
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
