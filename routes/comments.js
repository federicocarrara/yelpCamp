var express = require("express"),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware'); //We dont need to specify /index.js
    //because the file named index.js is considered default

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,  (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.rerirect('/camprgounds')
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          res.redirect('back');
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment._id);
          campground.save();
          req.flash('success', 'Comment added');
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Comment updated');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;
