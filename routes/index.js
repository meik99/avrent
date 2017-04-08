var express = require('express');
var router = express.Router();
var database = require("../src/database")();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AVRent', equipment:  database.equipment().findAll()});
});

module.exports = router;
