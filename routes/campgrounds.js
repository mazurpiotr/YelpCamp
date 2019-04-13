var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

var middleware = require("../middleware/");

router.get("/", function (req, res) {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds
      });
    }
  });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author
  };

  //Create new campground and save to database
  Campground.create(newCampground, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds/new");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

router.get("/:id", function (req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      res.redirect ("back");
    } else {
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});

//Edit and Update
router.get("/:id/edit", middleware.isCampgroundAuthor, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {} else {
      res.render("campgrounds/edit", {
        campground: foundCampground
      });
    }
  });
});

router.put("/:id", middleware.isCampgroundAuthor, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy campground
router.delete("/:id", middleware.isCampgroundAuthor, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;