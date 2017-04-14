/**
 * Created by michael on 13.04.17.
 */
module.exports = function () {
    function findEquipmentWithRentals(equipment, rental, callback) {
        var result = [];

        equipment.find({}, function (err, devices) {
            function nextDevice(idx) {
                result.push({
                    id: devices[idx].name,
                    borrowed: {
                        name: "Archiv",
                        clazz: "-",
                        date_from: -1,
                        date_to: -1
                    }
                });

                rental.find({equipmentName: devices[idx].name}, {limit: 1}, function (index) {
                    const i = index;
                    return function (err, rentals) {
                        if (err) console.log(err);
                        if (rentals.length >= 1) {
                            result[i].borrowed = {
                                name: rentals[0].pupil,
                                clazz: rentals[0].clazzName,
                                date_from: rentals[0].date_from,
                                date_to: rentals[0].date_to
                            };
                        }

                        if (i + 1 < devices.length) {
                            nextDevice(i + 1);
                        } else {
                            callback(result);
                        }
                    }
                }(idx));
            }

            if (devices.length > 0) {
                nextDevice(0);
            } else {
                callback(result);
            }
        });
    }

    function searchEquipment(equipment, rental, searchText, available, rentals, callback) {
        this.findEquipmentWithRentals(equipment, rental, function (result) {
            var storageEquipment = result;
            var equipments = [];

            available = available === "true";
            rentals = rentals === "true";

            for (var i = 0; i < storageEquipment.length; i++) {
                var searchToken =
                    storageEquipment[i].id;

                if (storageEquipment[i].borrowed.date_from > -1) {
                    searchToken +=
                        storageEquipment[i].borrowed.name +
                        storageEquipment[i].borrowed.clazz +
                        new Date(storageEquipment[i].borrowed.date_from) +
                        new Date(storageEquipment[i].borrowed.date_to);
                }

                searchToken = searchToken.toLowerCase();

                if (searchText === undefined || searchText === null || searchText === "" ||
                    searchToken.indexOf(searchText.toLowerCase()) > -1) {

                    if (rentals === true && available === true) {
                        equipments.push(storageEquipment[i]);
                    }
                    else if (rentals === false && available === true && storageEquipment[i].borrowed.date_from <= -1) {
                        equipments.push(storageEquipment[i]);
                    }
                    else if (rentals === true && available === false && storageEquipment[i].borrowed.date_from > -1) {
                        equipments.push(storageEquipment[i]);
                    }
                }
            }

            callback(equipments);
        });
    }

    var functions = {
        findEquipmentWithRentals: findEquipmentWithRentals,
        searchEquipment: searchEquipment
    }

    return functions;
}();