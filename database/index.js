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
                    models.rental.hasOne("equipment", models.equipment, {field: "equipmentName"});
                var rentalClazz =
                    models.rental.hasOne("clazz", models.clazz, {field: "clazzName"});

                db.drop(function (err) {
                    if (err) console.log(err);
                    db.sync(function (err2) {
                        if (err2) console.log(err2);

                        models.equipment.create({
                            name: "A 01"
                        }, function () {
                            
                        });
                        models.equipment.create({
                            name: "A 02"
                        }, function () {
                            
                        });
                        models.equipment.create({
                            name: "V 01"
                        }, function () {

                        });
                        models.equipment.create({
                            name: "V 02"
                        }, function () {

                        });
                        models.equipment.create({
                            name: "F 01"
                        }, function () {

                        });
                        models.equipment.create({
                            name: "F 02"
                        }, function () {

                        });

                        models.clazz.create({
                            name: "3CHIF"
                        }, function () {

                        });
                        models.clazz.create({
                            name: "4CHIF"
                        }, function () {

                        });
                        models.clazz.create({
                            name: "5CHIF"
                        }, function () {

                        });

                        models.rental.create({
                            equipmentName: "F 01",
                            clazzName: "3CHIF",
                            pupil: "Max Mustermann",
                            date_from: new Date(),
                            date_to: new Date(new Date().getTime() + 800000000)
                        }, function (err) {
                            if(err) console.log(err);
                        });
                        models.rental.create({
                            equipmentName: "A 01",
                            clazzName: "5CHIF",
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
