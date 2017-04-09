var equipment = require("../data/equipment.json");
var rentals = require("../data/rentals.json");

module.exports = function () {
    var functions = {
        findAll: function () {
            return equipment;
        },
        findFree: function () {
            var freeEquipment = [];

            for (var i = 0; i < equipment.length; i++){
                var found = false;

                for(var j = 0; j < rentals.length; j++){
                    if(rentals[j].equipmentId === equipment[i].id)
                        found = true;
                }

                if(found === false){
                    freeEquipment.push(equipment[i]);
                }
            }

            if(freeEquipment.length > 2)
                freeEquipment = freeEquipment.sort(function(a,b){
                    return a.type - b.type;
                });

            return freeEquipment;
        }
    };
    return functions;
};
