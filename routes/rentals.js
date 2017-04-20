/**
 * Created by michael on 09.04.17.
 */
var express = require("express");
var router = express.Router();

router.get("/:name", function (req, res) {
    var equipmentName = req.params.name;

    res.render("rentals/index", {equipmentName: equipmentName});
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
            }else{
                res.send({});
            }
        });
    } else {
        res.send({error: "Ungültige Id"});
    }
});

module.exports = router;