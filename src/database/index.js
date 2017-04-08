var equipmentDAO = require("./equipment.js")();

module.exports = function(){
  var functions = {
    equipment: function(){
      return equipmentDAO;
    }
  };
  return functions;
}
