var express = require('express');
var router = express.Router();

var equipmentDao = require("../dao/equipment");

/* GET home page. */
router.get('/', function (req, res, next) {
    equipmentDao.findEquipmentWithRentals(
        req.models.equipment,
        req.models.rental,
        function (result) {

            result = result.sort(function(a, b){
                return a.id.localeCompare(b.id);
            });

            res.render("equipment/index", {
                equipment: result
            });
        });
});

router.post("/", function (req, res) {
    var id = req.body.id;

    console.log(req.body);
    if (id) {
        req.models.equipment.find({name: id}, {}, function (err, results) {
            if(err) console.log(err);

            if (results.length > 0) {
                res.send({error: "Gerät mit dieser Id bereits vorhanden!"})
            }
            else {
                req.models.equipment.create({name: id}, function (err, result) {
                    if(err) console.log(err);

                    res.send({});
                });
            }
        });
    } else {
        res.send({error: "Ungültige Id"});
    }
});

router.put("/", function (req, res) {
    var name = req.body.id;
    var oldName = req.body.oldId;

    if (name && oldName) {
        req.models.equipment.find({name: oldName}, function (err, result) {
            if (err) console.log(err);

            if (result.length > 1) {
                res.send({error: "Schwerwiegender Fehler: Mehrere Geräte mit gleicher Id gefunden."})
            }
            else if (result.length <= 0) {
                res.send({error: "Gewähltes Gerät nicht gefunden"})
            } else {
                req.models.equipment.find({name: name}, function (err, results) {
                    if(err) console.log(err);

                    if (results.length > 0) {
                        res.send({error: "Gerät mit dieser Id bereits vorhanden!"})
                    } else {
                        result[0].name = name;
                        result[0].save(function (err) {
                            if(err) console.log(err);

                            res.send({});
                        });
                    }
                });
            }
        });
    } else {
        res.send({error: "Ungültige Ids"});
    }
});

router.delete("/", function(req, res){
   var name = req.body.id;


   if(name){
       req.models.equipment.find({name: name}, function (err, results) {
           if(err) console.log(err);

           if (results.length > 1) {
               res.send({error: "Schwerwiegender Fehler: Mehrere Geräte mit gleicher Id gefunden."})
           }
           else if(results.length <= 0){
               res.send({})
           }
           else{
               var nameToDelete = results[0].name;

               req.models.rental.find({equipmentName: nameToDelete}, function (err, rentals) {
                   if(err) console.log(err);

                   if(rentals.length > 0){
                       res.send({error: "Gerät wird derzeit verliehen und kann nicht gelöscht werden"})
                   }else{
                       results[0].remove(function (err) {
                           if(err) console.log(err);
                           res.send({});
                       });
                   }
               });
           }
       });
   }else{
       res.send({error: "Ungültige Id"});
   }

});

module.exports = router;
