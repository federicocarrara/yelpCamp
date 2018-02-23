var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var data = [
  {
    name:"Bossico",
    image:"http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
    description:"Great place, nice people. Great place, nice people. Great place, nice people. Great place, nice people. Great place, nice people."
  },
  {
    name:"Pianico",
    image:"http://www.tahoecitypud.com/assets/lake_forest_campground_page_photo.jpg",
    description:"Great place, nice people. Great place, nice people. Great place, nice people. Great place, nice people. Great place, nice people."
  }
]

function seedDB(){
// REMOVE CAMPGROUNDS
  Campground.remove({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Campgrounds removed!');
      // ADD SOME CAMPGROUNDS
      data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Campground created');
            // ADD COMMENTS
            Comment.create(
              {
                text:"I feel like that was the best experience of my life",
                author:"Tommy"
              }, (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment._id);
                  campground.save();
                  console.log('added comment');
                }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
