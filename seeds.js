var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment");

var lorem = "Vestibulum laoreet dui vitae ex posuere, id aliquam mauris pretium. Praesent finibus lorem in malesuada commodo. Duis et risus ipsum. Nulla a fermentum sem. Nulla facilisi. Aenean pharetra, nibh sit amet hendrerit lacinia, nulla nisl convallis lorem, ut faucibus orci nunc id metus. Aenean molestie bibendum lorem nec commodo. Aliquam id ante dui."

var data = [{
        name: "Cloud's Rest",
        image: "https://farm8.staticflickr.com/7375/15922107954_05c670bd64.jpg",
        description: lorem
    },
    {
        name: "Desert Mesa",
        image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
        description: lorem
    },
    {
        name: "Canyon Floor",
        image: "https://farm3.staticflickr.com/2871/12725041855_dc1539a8de.jpg",
        description: lorem
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all campgrounds!");
            //Add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a campground");
                        //Add a few comments
                        Comment.create({
                            text: "This place is great, but I wish there was internet.",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;