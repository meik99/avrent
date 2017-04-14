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

router.post("/", function (req, res) {
   var id = req.body.id;

   if(id){
       req.models.equipment.find({id: id}, {}, function (err, results) {
          if(results.length > 0){
              res.send({error: "Gerät mit dieser Id bereits vorhanden!"})
          }
       });
   }
});

module.exports = router;
