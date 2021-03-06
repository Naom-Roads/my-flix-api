const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport"); // Your local passport file

/**
 * This generates the JWT token for the user that will be used for authentication
 * @param user
 * @returns {*}
 */

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username, // This is the username you’re encoding in the JWT
        expiresIn: "7d", // This specifies that the token will expire in 7 days
        algorithm: "HS256" // This is the algorithm used to “sign” or encode the values of the JWT
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        console.log(req.body);
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user)  {
                console.log(err);
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });

            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}