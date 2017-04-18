var express = require('express');
var router = express.Router();


router.get("/", function (req, res) {
    req.models.clazz.find({}, function (err, classes) {
        if(err) console.log(err);

        res.render("clazz/index", {
            classes: classes
        });
    });
});

module.exports = router;