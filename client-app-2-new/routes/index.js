var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');


router.use(bodyParser.json());

router.get("/", function (req, res) {
    res.render("landing", {forms: null})
});

module.exports = router;