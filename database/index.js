var equipmentDAO = require("./equipment.js")();
var rentalDAO = require("./rentals.js")();

module.exports = function () {
    var functions = {
        equipment: function () {
            return equipmentDAO;
        },
        rental: function(){
            return rentalDAO;
        }
    };
    return functions;
};
