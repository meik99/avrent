var express = require('express');
var router = express.Router();
var moment = require("moment");

var equipmentDao = require("../dao/equipment");


/* GET home page. */
router.get('/', function (req, res, next) {

    var rentals =
        req.models.rental;
    var equipment =
        req.models.equipment;

    equipmentDao.findEquipmentWithRentals(equipment, rentals, function (result) {
        res.render('index',
        {
            title: 'AVRent',
            equipments: result,
            moment: moment,
            authenticated: req.isAuthenticated()
        });
    });

});

router.post("/search", function (req, res) {
    var equipment = req.models.equipment;
    var rental = req.models.rental;
    var searchText = req.body.searchText;
    var available = req.body.available;
    var rentals = req.body.rentals;

    equipmentDao.searchEquipment(equipment, rental, searchText, available, rentals, function (result) {
        result = result.sort(function(a, b){
            if(req.body.sort === "device"){
                return a.id.localeCompare(b.id);
            } else{
                return a.borrowed.clazz.localeCompare(b.borrowed.clazz);
            }
        });

        res.render(
            "data",
            {
                title: "AVRent",
                equipments: result,
                moment: moment
            }
        )
    });
});

module.exports = router;
