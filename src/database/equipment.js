var equipment = require("../../data/equipment.json");

module.exports = function(){
  var functions = {
    findAll: function(){
      return equipment;
    }
  };
  return functions;
}
