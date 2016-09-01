var mongoose = require('mongoose'), assert = require('assert');

var Dishes = require('./models/dishes-3');
var Promotions = require('./models/promotions');
var Leaders = require('./models/leaders');

var url = 'mongodb://localhost:27017/conFusion';

mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected correctly to server');
    Dishes.create({
        name: "Uthapizza",
        image: "images/uthapizza.png",
        category: "mains",
        // label: "Hot",
        price: "4.99",
        description: "A unique . . .",
        comments: [
            {
                rating: 5,
                comment: "Imagine all the eatables, living in conFusion!",
                author: "John Lemon"
            },
            {
                rating: 4,
                comment: "Sends anyone to heaven, I wish I could get my mother-in-law to eat it!",
                author: "Paul McVites"
            }
        ]
    }, function (err, dish) {
        if (err) throw err;
        console.log(dish);
        // CAPTURE ID OF THE DISH
        var id = dish._id;
        //DELAY
        setTimeout(function () {
            Dishes.findByIdAndUpdate(id, {
                $set: {
                    description: "Updated Test"
                }
            }, {
                new: true
            })
                .exec(function (err, dish) {
                    if (err) throw err;
                    console.log("Updated Dish!!");
                    console.log(dish);

                    // UPDATING COMMENTS
                    dish.comments.push({
                        rating: 5,
                        comment: 'I\'m loving It!!',
                        author: "Shona"
                    });

                    dish.save(function (err, dish) {
                        console.log("Updated Comments !!");
                        console.log(dish);

                        // SET DATABASE TO PRISTINE CONDITION
                        // db.collection('dishes').drop(function () {
                        //     db.close();
                        // });
                        console.log("Now working on promotions");
                        promotionOperation();
                    })
                });
        }, 3000);
    });
});

function promotionOperation() {
    Promotions.create({
        name: "Weekend Grand Buffet",
        image: "images/buffet.png",
        label: "New",
        price: "19.99",
        description: "Featuring . . ."
    }, function (err, promotion) {
        if (err) throw err;
        console.log(promotion);

        var id = promotion._id;
        setTimeout(function () {
            Promotions.findByIdAndUpdate(id, {
                $set: {
                    description: "Updated Promotion description"
                }
            }, {new: true})
                .exec(function (err, promotion) {
                    if (err) throw err;
                    console.log("Updated Promotions!!");
                    console.log(promotion);
                    leadersOperation();
                })
        }, 3000)
    })
}
function leadersOperation() {
    Leaders.create({
        name: "Peter Pan",
        image: "images/alberto.png",
        designation: "Chief Epicurious Officer",
        abbr: "CEO",
        description: "Our CEO, Peter, . . ."
    }, function (err, leader) {
        if (err) throw err;
        console.log(leader);

        var id = leader._id;
        setTimeout(function () {
            Leaders.findByIdAndUpdate(id, {
                $set: {
                    description: "Updated Leader description"
                }
            }, {new: true})
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log("Updated Leaders!!");
                    console.log(leader);
                    // SET DATABASE TO PRISTINE CONDITION
                    db.collection('leaders').drop(function () {
                        db.close();
                    });
                    db.collection('promotions').drop(function () {
                        db.close();
                    });
                    db.collection('dishes').drop(function () {
                        db.close();
                    });
                })
        }, 3000)
    })
}
