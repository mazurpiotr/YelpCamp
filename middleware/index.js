var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

var middlewareObj = {
    isLoggedIn: function () {},
    isCommentAuthor: function () {},
    isCampgroundAuthor: function () {}
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

middlewareObj.isCommentAuthor = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not the comment's owner.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

middlewareObj.isCampgroundAuthor = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("/campgrounds");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not the campground's owner.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

module.exports = middlewareObj;