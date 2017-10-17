var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    var className = req.body.id;
    var oldClassName = req.body.oldId;

    if (className) {
        req.body.id = className.toUpperCase().replace(" ", "");
    }
    if (oldClassName) {
        req.body.oldId = oldClassName.toUpperCase().replace(" ", "");
    }

    next();
});

router.get("/", function (req, res) {

    if(req.isAuthenticated()) {
        req.models.clazz.find({}, function (err, classes) {
            if (err) console.log(err);

            if (classes.length > 0) {
                var i = 0;

                function next(index) {
                    req.models.rental.find({clazzName: classes[index].name}, function (err, rentals) {
                        if (rentals.length > 0) {
                            classes[index].hasRental = true;
                        } else {
                            classes[index].hasRental = false;
                        }

                        if (i + 1 < classes.length) {
                            next(++i);
                        } else {
                            res.render("clazz/index", {
                                classes: classes,
                                authenticated: req.isAuthenticated()
                            });
                        }
                    });
                }

                next(i);
            } else {
                res.render("clazz/index", {
                    classes: classes
                });
            }
        });
    }
    else{
        res.render("login");
    }
});

router.post("/", function (req, res) {

    if(req.isAuthenticated()) {
        var newClass = req.body.id;

        if (newClass && typeof newClass === typeof "" && newClass.length > 0) {
            req.models.clazz.find({name: newClass}, function (err, oldClasses) {
                if (err) console.log(err);

                if (oldClasses.length > 0) {
                    res.send({error: "Klasse existiert bereits"});
                } else {
                    req.models.clazz.create({name: newClass}, function (err) {
                        if (err) {
                            console.log(err);
                            res.send({error: "Bei der Verarbeitung ist ein Fehler aufgetreten."});
                        } else {
                            res.send({});
                        }
                    });
                }
            });
        } else {
            res.send({error: "Ungültiger Name!"});
        }
    }
});

router.put("/", function (req, res) {

    if(req.isAuthenticated()) {
        var className = req.body.id;
        var oldClassName = req.body.oldId;

        if (className && oldClassName &&
            typeof className === typeof "" &&
            typeof oldClassName === typeof "" &&
            className.length > 0 &&
            oldClassName.length > 0) {

            req.models.clazz.find({name: className}, function (err, classes) {
                if (err) console.log(err);

                if (classes.length > 0) {
                    res.send({error: "Klasse existiert bereits"});
                } else {
                    req.models.clazz.find({name: oldClassName}, function (err, oldClasses) {
                        if (err) console.log(err);

                        if (oldClasses.length > 0) {
                            oldClasses[0].name = className;
                            oldClasses[0].save(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.send({error: "Bei der Verarbeitung ist ein Fehler aufgetreten."});
                                } else {
                                    req.models.rental.find({clazzName: oldClassName}, function (err, rentals) {
                                        if (rentals.length > 0) {
                                            var i = 0;

                                            function next(index) {
                                                rentals[index].clazzName = className;
                                                rentals[index].save(function (err) {
                                                    if (err) console.log(err);

                                                    if (++index < rentals.length) {
                                                        next(index);
                                                    } else {
                                                        res.send({});
                                                    }
                                                });
                                            }

                                            next(i);

                                        } else {
                                            res.send({});
                                        }
                                    });
                                }
                            });
                        } else {
                            res.send({error: "Klasse konnte nicht gefunden werden"});
                        }
                    });
                }
            });

        } else {
            res.send({error: "Ungültige Namen!"});
        }
    }
});

router.delete("/", function (req, res) {

    if(req.isAuthenticated()) {
        var className = req.body.id;

        if (className &&
            typeof className === typeof "" &&
            className.length > 0) {

            req.models.rental.find({clazzName: className}, function (err, rentals) {
                if (rentals.length > 0) {
                    res.send({error: "Klasse kann nicht gelöscht werden!"});
                } else {
                    req.models.clazz.find({name: className}, function (err, classes) {
                        if (err) console.log(err);

                        if (classes.length > 1) {
                            console.error("Classname ambiguous");
                        }
                        if (classes.length === 1) {
                            classes[0].remove(function (err) {
                                if (err) console.log(err);

                                res.send({});
                            });
                        } else {
                            console.error("Class Router Delete: Unknown error");
                            res.send({error: "Ein unbekannter Fehler ist eingetreten!"});
                        }
                    })
                }
            });

        } else {
            res.send({error: "Ungültige Namen!"});
        }
    }
});

module.exports = router;