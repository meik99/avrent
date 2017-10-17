
var passport = require("passport");
var ldapStrategy = require("passport-ldapauth");
var session = require("express-session");

module.exports = function (app) {


    passport.use(new ldapStrategy({
        server: {
            url: 'ldap://127.0.0.1:389',
            bindDN: "cn=admin,dc=edu,dc=htl-leonding,dc=ac,dc=at",
            bindCredentials: "root",
            searchBase: "ou=teachers,ou=htl,dc=EDU,dc=HTL-LEONDING,dc=AC,DC=AT",
            searchFilter: "(uid={{username}})"
        },
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true

    }, function (req, user, done) {
        done(null, user);
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.use(session({
        secret: 'ldap secret'
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // passport.authenticate('ldapauth', {session: false}),



    app.get('/login',function(req, res) {
        res.render("login");
    });

    app.get("/logout", function (req, res) {
        if(req.logout)
            req.logout();
        res.redirect("/");
    });

    //, failureRedirect: "/login", successRedirect: "/"
    app.post("/login",
        function (req, res, next) {
            passport.authenticate('ldapauth', {session: true}, function (err, user, info) {
                console.log(info);
                if (err) {
                    return next(err); // will generate a 500 error
                }
                // Generate a JSON response reflecting authentication status
                if (!user) {
                    return res.send({success: false, message: 'authentication failed'});
                }
                req.logIn(user, function (err) {
                    return res.send({success: true, message: 'authentication succeeded'});
                });
            })(req, res, next)});

    // passport.serializeUser(function(user, done) {
    //     done(null, user);
    // });
    //
    // passport.deserializeUser(function(id, done) {
    //     User.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    // });
};