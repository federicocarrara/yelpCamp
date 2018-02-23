var Campground = require('../models/campground'),
    Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        // I add !foundCampground here beacuse the fact of
        // not finding an id ist an error
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // .equals() is a method of mongoose that allowes us to compare the obj
        // foundCampground.author.id with the string req.user._id
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Permission denied');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to login to do that');
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        // I add !foundComment here beacuse the fact of
        // not finding an id ist an error
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        // .equals() is a method of mongoose that allowes us to compare the obj
        // foundComment.author.id with the string req.user._id
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You dont have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to login to do that');
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to login to do that');
  res.redirect('/login');
}

module.exports = middlewareObj;
