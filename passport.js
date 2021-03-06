const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    Models = require("./models.js"),
    passportJWT = require("passport-jwt");

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
 * A passport strategy. It is a middleware that is used to authenticate users.
 * It checks whether the information entered is correct and if so returns user object
 * @param username
 * @param password
 * @param callback
 * @returns callback
 */
passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({Username: username}, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        if (!user) {
            console.log('Incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

/* This is the middleware that is used to authenticate users. */
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));