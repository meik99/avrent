var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var orm = require("orm");
var nodemailer = require("nodemailer");

var index = require('./routes/index');
var users = require('./routes/users');
var equipment = require("./routes/equipment");
var rentals = require("./routes/rentals");
var clazz = require("./routes/clazz");
var database = require("./database")(orm);

var credentials = require("./credentials.json");

var app = express();

app.use(orm.express(database.connection_url, database.definitions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/equipment', equipment);
app.use('/rentals', rentals);
app.use("/class", clazz);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

var emailInterval = setInterval(function () {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: credentials.email.user,
            pass: credentials.email.pass
        }
    });

    var mailOptions = {
        from: "AVRent <" + credentials.email.user + ">",
        to: "michael.rynk@hotmail.com",
        subject: "Verleiherinnerung",
        text: ""
    };

    orm.connect(database.connection_url, function (err, db) {
        if (err) console.log(err);
        var dateNow = new Date();

        db.driver.execQuery(
            "select * from rental where date_to <= ?",
            [dateNow],
            function (err, rentals) {
                if (err) console.log(err);
                var dateNow = new Date();

                for (var i = 0; i < rentals.length; i++) {
                    mailOptions.text = mailOptions.text +
                        `Das Gerät\n
                        ${rentals[i].equipmentName}\n
                        ist überfällig.\n
                        SchülerIn: \n
                        ${rentals[i].pupil}\n
                        Klasse: \n
                        ${rentals[i].clazzName}\n
                        Geplantes Rückgabedatum: ${rentals[i].date_to}\n
                        \n`;
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) console.log(error);
                    // console.log(info);
                });
            });
    });

// }, 1000 * 10);
}, 1000 * 60 * 60 * 24);