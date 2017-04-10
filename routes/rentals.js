/**
 * Created by michael on 09.04.17.
 */
var express = require("express");
var router = express.Router();
var database = require("../database")();

router.get("/", function (req, res) {
    res.send(database.rental().findAll());
});

router.get("/add", function (req, res) {
    var equipment = database.equipment().findFree();
    var types = [];

    for(var i = 0; i < equipment.length; i++){
        var tmpTypes = types.filter(function (item) {
           return item.type === equipment[i].type;
        });

        if(tmpTypes.length <= 0){
            types.push({type: equipment[i].type, count: 1});
        }else{
            tmpTypes[0].count++;
        }
    }

    types = types.sort(function (a, b) {
       return a.type.localeCompare(b.type);
    });

    equipment = equipment.sort(function (a, b) {
       return a.description.localeCompare(b.description);
    });

    res.render("rentals/index", {equipment: equipment, types: types});
});

module.exports = router;