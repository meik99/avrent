var express = require('express');
var router = express.Router();
var database = require("../database")();
var moment = require("moment");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index',
        {
            title: 'AVRent',
            rentals: database.rental().findAll(),
            equipments: database.equipment().findAll(),
            moment: moment
        });
});

module.exports = router;
