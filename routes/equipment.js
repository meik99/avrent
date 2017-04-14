var express = require('express');
var router = express.Router();

var equipmentDao = require("../dao/equipment");

/* GET home page. */
router.get('/', function(req, res, next) {
    equipmentDao.findEquipmentWithRentals(
        req.models.equipment,
        req.models.rental,
        function (result) {
            res.render("equipment/index", {
                equipment: result
            });
        });
});

module.exports = router;
