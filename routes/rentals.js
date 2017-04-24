/**
 * Created by michael on 09.04.17.
 */
var express = require("express");
var router = express.Router();

router.get("/:name", function (req, res) {
    var equipmentName = req.params.name;

    req.models.clazz.find({}, function (err, classes) {
        res.render("rentals/index", {
            equipmentName: equipmentName,
            classes: classes
        });
    });
});

router.delete("/", function (req, res) {
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
});

router.post("/", function (req, res) {
    var equipmentName = req.body.equipmentName;
    var clazzName = req.body.clazzName;
    var pupilName = req.body.pupilName;
    var dateTo = req.body.dateTo;

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
                            var dateTo = new Date();
                            dateTo = dateTo.setTime(dateTo.getTime() + (1000 * 60 * 60 * 24 * 7 * 3));
                            req.models.rental.create({
                                equipmentName: equipmentName,
                                clazzName: clazzName,
                                pupil: pupilName,
                                date_from: new Date(),
                                date_to: new Date(dateTo)
                            }, function (err) {
                                if (err) console.log(err);
                                console.log("inserted");
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
});

function isValidString(param) {
    return param && typeof param === typeof "" && param.length > 0
}

module.exports = router;