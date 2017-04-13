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
                    models.rental.hasOne("equipment", models.equipment, {field: "equipmentId"});
                var rentalClazz =
                    models.rental.hasOne("clazz", models.clazz, {field: "clazzId"});

                db.drop(function (err) {
                    if (err) console.log(err);
                    db.sync(function (err2) {
                        if (err2) console.log(err2);

                        models.equipment.create({
                            id: "A 01"
                        }, function () {
                            
                        });
                        models.equipment.create({
                            id: "A 02"
                        }, function () {
                            
                        });
                        models.equipment.create({
                            id: "V 01"
                        }, function () {

                        });
                        models.equipment.create({
                            id: "V 02"
                        }, function () {

                        });
                        models.equipment.create({
                            id: "F 01"
                        }, function () {

                        });
                        models.equipment.create({
                            id: "F 02"
                        }, function () {

                        });

                        models.clazz.create({
                            id: "3CHIF"
                        }, function () {

                        });
                        models.clazz.create({
                            id: "4CHIF"
                        }, function () {

                        });
                        models.clazz.create({
                            id: "5CHIF"
                        }, function () {

                        });

                        models.rental.create({
                            equipmentId: "F 01",
                            clazzId: "3CHIF",
                            pupil: "Max Mustermann",
                            date_from: new Date(),
                            date_to: new Date(new Date().getTime() + 800000000)
                        }, function (err) {
                            if(err) console.log(err);
                        });
                        models.rental.create({
                            equipmentId: "A 01",
                            clazzId: "5CHIF",
                            pupil: "Maxine Musterfrau",
                            date_from: new Date(),
                            date_to: new Date(new Date().getTime() + 800000000)
                        }, function (err) {
                            if(err) console.log(err);
                        });


                        next();
                    });
                });
            }
        }
    };
    return result;
};
