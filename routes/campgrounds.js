var express = require("express"),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware'); //We dont need to specify /index.js
    //because the file named index.js is considered default

router.get("/campgrounds", (req, res) => {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds
      });
    }
  });
});

router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description
  };
  Campground.create(newCampground,
    function(err, newCampground) {
      if (err) {
        console.log('something went wrong');
      } else {
        newCampground.author.id = req.user._id;
        newCampground.author.username = req.user.username;
        newCampground.save();
        res.redirect('/campgrounds');
        console.log(newCampground.name + ' added');
      }
    }
  );
});

router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err || !foundCampground) {
      // I add !foundComment here beacuse the fact of
      // not finding an id ist an error
      console.log(err);
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds');
    } else {
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', {
      campground: foundCampground
    });
  });
});


router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
