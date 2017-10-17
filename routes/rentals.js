/**
 * Created by michael on 09.04.17.
 */
var express = require("express");
var router = express.Router();
var passport = require("passport");
var moment = require("moment");

router.get("/:name", function (req, res) {
    if(req.isAuthenticated()){
        var equipmentName = req.params.name;

        req.models.clazz.find({}, function (err, classes) {
            res.render("rentals/index", {
                equipmentName: equipmentName,
                classes: classes,
                authenticated: req.isAuthenticated()
            });
        });
    }else{
        res.render("login");
    }
});

router.delete("/", function (req, res) {
    if(req.isAuthenticated()) {
        var equipmentName = req.body.equipmentName;

        if (equipmentName && typeof equipmentName === typeof "" && equipmentName.length > 0) {
            req.models.rental.find({equipmentName: equipmentName}, function (err, rentals) {
                if (err) console.log(err);

                if (rentals.length > 1) {
                    console.error({error: "Rentals have ambiguous equipment!"});
                }
                if (rentals.length > 0) {
                    rentals[0].remove(function (err) {
                        if (err) console.log(err);
                        res.send({});
                    });
                } else {
                    res.send({});
                }
            });
        } else {
            res.send({error: "Ungültige Id"});
        }
    }
});

router.post("/", function (req, res) {

    if(req.isAuthenticated()) {
        var equipmentName = req.body.equipmentName;
        var clazzName = req.body.clazzName;
        var pupilName = req.body.pupilName;
        var dateTo = req.body.dateTo;
        var dateToDate = new Date(dateTo);

        console.log(
            dateToDate
        );

        if (!dateTo || isValidString(dateTo) === false ||
            !dateToDate) {
            dateToDate = new Date();
            dateToDate = dateToDate.setTime(dateToDate.getTime() + 604800000);

            console.log(
                dateToDate
            );
        }

        if (isValidString(equipmentName) &&
            isValidString(clazzName) &&
            isValidString(pupilName)

        ) {
            req.models.rental.find({equipmentName: equipmentName}, function (err, rental) {
                if (rental.length > 0) {
                    res.send({error: "Gerät wird bereits verliehen!"});
                }
                else {
                    function insertRental() {
                        req.models.equipment.find({name: equipmentName}, function (err, equipment) {
                            if (equipment.length <= 0) {
                                res.send({error: "Gerät existiert nicht!"});
                            } else {
                                req.models.rental.create({
                                    equipmentName: equipmentName,
                                    clazzName: clazzName,
                                    pupil: pupilName,
                                    date_from: new Date(),
                                    date_to: dateToDate
                                }, function (err) {
                                    if (err) console.log(err);
                                    res.send({});
                                });
                            }
                        });
                    }

                    req.models.clazz.find({name: clazzName}, function (err, clazzes) {
                        if (clazzes.length > 0) {
                            insertRental();
                        } else {
                            req.models.clazz.create({name: clazzName}, function (error) {
                                if (error) console.log(error);
                                insertRental();
                            });
                        }
                    });
                }
            });
        }
    }
});

function isValidString(param) {
    return param && typeof param === typeof "" && param.length > 0
}

module.exports = router;