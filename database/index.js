// var mysql = require("mysql");
var mysql_config = {
    host: "localhost:3306",
    user: "root",
    password: "root",
    database: "avrent"
};
//
// var connection = mysql.createConnection(mysql_config);
//
var equipment = require("./equipment");
var clazz = require("./clazz");
var rental = require("./rentals");

module.exports = function(orm){
    var result = {
        connection_url: "mysql://" +
        mysql_config.user +
        ":" +
        mysql_config.password +
        "@" +
        mysql_config.host +
        "/" +
        mysql_config.database,

        definitions: {
            define: function (db, models, next) {
                rental = rental(orm);
                models.equipment = db.define("equipment", equipment.variables, equipment.options);
                models.clazz = db.define("clazz", clazz.variables, clazz.options);
                models.rental = db.define("rental", rental.variables, rental.options);

                var rentalEquipment =
                    models.rental.hasOne("equipment", models.equipment, {field: "equipmentId", reverse: "rental"});
                var rentalClazz =
                    models.rental.hasOne("clazz", models.clazz, {field: "clazzId"});

                db.drop(function (err) {
                    if (err) console.log(err);
                    db.sync(function (err2) {
                        if (err2) console.log(err2);
                        next();
                    });
                });
            }
        }
    };
    return result;
};
