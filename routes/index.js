var express = require('express');
var router = express.Router();
var moment = require("moment");

function getEquipment(equipment, rental) {
    var result = [];
    var rentals = rental.find();
    var devices = equipment.find();

    

    for(var i = 0; i < rentals.length; i++){
        var device = rentals[i].getEquipment();
        result.push({
            id: device.id,
            borrowed: {
                name: rentals[i].pupil,
                clazz: rentals[i].getClazz().id,
                date_from: rentals[i].date_from,
                date_to: rentals[i].date_to
            }
        });
    }

    return result;

    for (var i = 0; i < equipment.length; i++) {
        equipment[i] = {
            id: equipment[i].id,
            borrowed: {
                name: "Archiv",
                clazz: "-",
                date_from: -1,
                date_to: -1
            }
        };

        for (var j = 0; j < rental.length; j++) {
            if (rental[j].equipmentId === equipment[i].id) {
                equipment[i].borrowed = {
                    name: rental[j].pupil,
                    clazz: rental[j]._class,
                    date_from: rental[j].date_from,
                    date_to: rental[j].date_to
                };
            }
        }
    }

    return equipment;
}

function searchEquipment(searchText, available, rentals) { //Outsource to database when ready
    var storageEquipment = getEquipment();
    var equipments = [];

    available = available === "true";
    rentals = rentals === "true";

    for (var i = 0; i < storageEquipment.length; i++) {
        var searchToken =
            storageEquipment[i].id;

        if (storageEquipment[i].borrowed.date_from > -1) {
            searchToken +=
                storageEquipment[i].borrowed.name +
                storageEquipment[i].borrowed.clazz +
                new Date(storageEquipment[i].borrowed.date_from) +
                new Date(storageEquipment[i].borrowed.date_to);
        }

        searchToken = searchToken.toLowerCase();

        if (searchText === undefined || searchText === null || searchText === "" ||
            searchToken.indexOf(searchText.toLowerCase()) > -1) {

            if (rentals === true && available === true) {
                equipments.push(storageEquipment[i]);
            }
            else if (rentals === false && available === true && storageEquipment[i].borrowed.date_from <= -1) {
                equipments.push(storageEquipment[i]);
            }
            else if (rentals === true && available === false && storageEquipment[i].borrowed.date_from > -1) {
                equipments.push(storageEquipment[i]);
            }
        }
    }

    return equipments;
}

/* GET home page. */
router.get('/', function (req, res, next) {

    var rentals =
        req.models.rental;
    var equipment =
        req.models.equipment;

    res.render('index',
        {
            title: 'AVRent',
            equipments: getEquipment(equipment, rentals),
            moment: moment
        });
});

router.post("/search", function (req, res) {
    var result = searchEquipment(req.body.searchText, req.body.available, req.body.rentals);

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

module.exports = router;
