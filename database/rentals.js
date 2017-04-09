/**
 * Created by michael on 09.04.17.
 */
var rentals = require("../data/rentals.json");

module.exports = function () {
    var functions = {
        findAll: function(){
            return rentals;
        }
    };
    return functions;
};