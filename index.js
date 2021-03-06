/**
 * @file This file sets up express application, the server and implements the various calls to the API endpoints.
 * The Data use mongoose models to structure the data, that can be found in the models file.
 * Access is established through authentication which is implemented using Passport and can be located in the
 * passport file. Once connected the data is accessed via the MongoDB Atlas. The application is hosted on Heroku.
 * @type {{DotenvParseOutput: DotenvParseOutput, DotenvParseOptions: DotenvParseOptions, parse: <T=DotenvParseOutput extends DotenvParseOutput>(src: (string | Buffer), options?: DotenvParseOptions) => T, DotenvConfigOptions: DotenvConfigOptions, DotenvConfigOutput: DotenvConfigOutput, config: (options?: DotenvConfigOptions) => DotenvConfigOutput, load: (options?: DotenvConfigOptions) => DotenvConfigOutput}}
 * @requires express for creating the express application
 * @requires morgan logger is middleware that will create logs for the requests
 * @requires mongoose implements data schemas and the file can be found under ./models.js
 * @requires cors allows server to indicate any origins other than it's own to permit loading requests
 * @requires passport for authentication, this is implemented in ./auth.js
 * @requires express validator validates the data
 *
 */


const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");
uuid = require("uuid");

const mongoose = require("mongoose");
const express = require("express");
const Models = require("./models.js");

// Schemas pulled from ./models.js using mongoose

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
const cors = require("cors");
app.use(cors());
app.use(morgan("common"));
app.use(express.urlencoded({extended: true}));

const passport = require("passport");
require("./passport");

const {check, validationResult} = require("express-validator");
app.use(express.json());
app.use(express.static("public"));

require("./auth")(app);

// app.METHOD(PATH, HANDLER)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

// Main Page
/**
 * Gets root directory and displays it for user
 * @method GET
 * @param {string} URL
 * @callback sendFile
 * @param {Object} req
 * @param {Object} res
 *
 */

app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", {root: __dirname});
});


/**
 * API CALLS TABLE PAGE
 * @method GET
 * @param {string} URL
 * @callback {string} URL send public/apicalls
 * @param {Object} req
 * @param {Object} res
 */

app.get("/apicalls", (req, res) => {
    res.send("public/apicalls");
});


/**
 * Gets list of all movies in the database, the call also populates the director and genre information
 * so that it is easier to pull the information directly from the movie object itself.
 * @method GET
 * @param {string} URL
 * @callback {string}
 * @param {Object} req
 * @param {Object} res
 */

app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
        .populate("director")
        .populate("genres", "", "Genre")
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 *
 */

// Gets movie by title
/**
 *  This code is fetching a movie from the database based on the title.
 * @method GET
 * @param {string} URL
 * @callback {string}
 * @param {Object} req
 * @param {Object} res
 *
 */
app.get("/movies/:title", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Movies.findOne({title: req.params.title})
        .then((movie) => {
            res.send(movie);
        });
});

/**
 * This code is fetching a specific genre from the database.
 * @method GET
 * @param {string} URL
 * @callback {string}
 * @param {Object} req
 * @param {Object} res
 *
 */
app.get("/movies/genres/:genreId", passport.authenticate('jwt',
        {session: false}), (req, res) => {
        Genres.findOne({name: req.params.id})
            .then(genre => {
                res.json(genre);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

/**
 *  This code is retrieving a specific director from the database by id.
 * @method GET
 * @param {string} URL
 * @callback {Object} Director
 * @param {Object} req
 * @param {Object} res
 */

app.get("/movies/directors/:directorId", passport.authenticate('jwt',
        {session: false}), (req, res) => {
        Directors.findOne({name: req.params.name})
            .then(genre => {
                res.json(genre);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);



/** This code is retrieving a specific director from the database by name.
 * @method GET
 * @param {string} URL
 * @callback {Object} Director
 * @param {Object} req
 * @param {Object} res
  */
app.get("/directors/:name", passport.authenticate('jwt', {session: false}), (req, res) => {
        Directors.findOne({name: req.params.name})
            .then(directors => {
                res.json(directors);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//Gets all Directors

/**
 *  This code is fetching all the directors from the database and sending them back to the client.
 * @method GET
 * @param {string} URL
 * @callback {array} Directors
 * @param {Object} req
 * @param {Object} res
 *
 */
app.get("/directors", passport.authenticate('jwt',
        {session: false}), (req, res) => {
        Directors.find()
            .then(directors => {
                res.status(201).json(directors);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);


/**
 * This code is retrieving a genre by name.
 * @method GET
 * @param {string} URL
 * @callback {Object} Genre
 * @param {Object} req
 * @param {Object} res
 */
app.get("/genres/:name", passport.authenticate('jwt',
        {session: false}), (req, res) => {
        Genres.findOne({name: req.params.name})
            .then(genre => {
                res.json(genre);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);


/**
 *  This code is fetching all the genres from the database and sending them back to the client.
 * @method GET
 * @param {string} URL
 * @callback {array} Genres
 * @param {Object} req
 * @param {Object} res
 */
app.get("/genres", passport.authenticate('jwt', {session: false}), (req, res) => {
    Genres.find()
        .then(genres => {
            res.status(200).json(genres);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add a movie

/**
 * This code is creating a new movie in the database.
 * @method POST
 * @param {string} URL
 * @callback {string} status
 * @param {Object} req
 * @param {Object} res
 *
 * */
app.post("/movies", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Movies.findOne({title: req.params.title})
        .then((movie) => {
            if (movie) {
                return res.status(400).send(req.body.movie + " already exists");
            } else {
                Movies
                    .create({
                        title: req.body.title,
                        description: req.body.description,
                        director: req.body.director,
                        genres: req.body.genres,
                        imageurl: req.body.imageurl,
                        featured: req.body.featured,
                    })
                    .then((user) => {
                        res.status(201).send(user);
                    });
            }
        })
});


// Remove a Movie from movie list

/**
 *  This code is deleting a movie from the database.
 * @method DELETE
 * @param {string} URL
 * @callback {string} status
 * @param {Object} req
 * @param {Object} res
 *
 */
app.delete("/movies/:title", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Movies.findOneAndRemove({title: req.params.title})
        .then((movie) => {
            if (!movie) {
                res.status(400).send(req.params.title + "was not found");
            } else {
                res.send(req.params.title + " was deleted");
            }
        });

});

// USERS RES AND REQ START HERE

/**
 * This is a route that requires a user to be logged in.
 * @method GET
 * @param {string} URL
 * @callback {Object} User
 * @param {Object} req
 * @param {Object} res
 */
app.get("/users", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.send(users);
        })
});


/**
 *  This is a route that allows us to get a user by username.
 * @method GET
 * @param {string} URL
 * @callback {Object} User
 * @param {Object} req
 * @param {Object} res
 */
app.get("/users/:username", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.findOne({username: req.params.username})
        .then((user) => {
            console.log(user);
            res.send(user);
        })
});

// favorite movies list

/**
 *  This code is fetching all the movies that a user has favorited.
 * @method GET
 * @param {string} URL
 * @param {Object} User
 * @param {array} movies
 * @param {Object} req
 * @param {Object} res
 * @param {string} username
 * @callback {array} favoriteMovies
 */
app.get("/users/:username/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne({username: req.params.username})
        .then((user) => {
            Movies.find({_id: {$in: user.favoriteMovies}})
                .populate("director")
                .populate("genres", "", "Genre")
                .then((movies) => {
                    res.status(200).json(movies);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// Allows new User to be added

/**
 *  This code is creating a new user. Also validates user information and ensures that the user is unique
 *  Hashed password is used to provide additional security for the password by turning it into a hash
 * @method POST
 * @param {string} URL
 * @callback {Object} User
 * @param {Object} req
 * @param {Object} res
 */
app.post("/register",
    [ // validations
        check('username', 'Username is required').isLength({min: 5}),
        check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOne({username: req.body.username})
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.username + " already exists");
                } else {
                    Users
                        .create({
                            username: req.body.username,
                            password: hashedPassword,
                            email: req.body.email,
                            birthday: req.body.birthday
                        })
                        .then((user) => {
                            res.status(201).send(user);
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).send("Error: " + err);
                        });
                }
            });
    });


// Allows Users to update Profile

/**
 *  This is a patch request. It is updating the user's information.
 * @method PATCH
 * @param {string} URL
 * @callback {Object} User
 * @param {Object} req
 * @param {Object} res
 *
 */
app.patch("/users/:username", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.findOne({username: req.params.username})
        .then((user) => {
            if (!user) {
                res.status(400).json({data: req.params.username + " was not found"});
            } else {
                user.set(req.body);
                user.save().then((updatedUser) => {
                    res.send(updatedUser);
                })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({data: "Error" + err});
                    })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({data: "Error" + err});
        });
});


/**
 *  This code is adding a movie to a user's favorite list.
 * @method POST
 * @param {string} URL
 * @callback {Object} User
 * @param {Object} req
 * @param {Object} res
 */
app.post("/users/:username/movies/:movieId", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.findOne({username: req.params.username})
        .then((user) => {
            if (!user) {
                return res.status(404).send("User was not found")
            }
            if (user.favoriteMovies && !user.favoriteMovies.includes(req.params.movieId)) {

                user.favoriteMovies.push(req.params.movieId)
                user.save(() => {
                    res.json({data: req.params.movieId + " Movie was added to Favorites"})

                })
            } else {
                res.json({data: "Movie is already added"});
            }
        });
});


// Allows user to delete movie

/**
 *  This code is removing a movie from a user's favorite list. It also checks to see if the movie has already
 *  been removed.
 * @method DELETE
 * @param {string} URL
 * @param {Object} User
 * @param {array} favoriteMovies
 * @callback {string}
 * @param {Object} req
 * @param {Object} res
 *
 */
app.delete("/users/:username/movies/:movieId", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.findOne({username: req.params.username})
        .then((user) => {
            if (!user) {
                return res.status(404).send("User does not exist")
            }
            if (user.favoriteMovies && user.favoriteMovies.includes(req.params.movieId)) {
                user.favoriteMovies.remove(req.params.movieId)
                user.save(() => {
                    res.json({data: req.params.movieId + "Movie was removed from Favorites"});
                })
            } else {
                res.json({data: "Movie was not found"});
            }
        });
});

// Allows user to deregister

/**
 *  This code is deleting a user from the database.
 * @method DELETE
 * @param {string} URL
 * @callback {Object} User
 * @param {Object} req
 * @param {Object} res
 *
 */
app.delete("/users/:username", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.findOneAndRemove({username: req.params.username})
        .then((user) => {
            if (!user) {
                res.status(400).json(req.params.username + " was not found.");
            } else {
                res.json({data: req.params.username + " was deleted."});
            }
        })
});


const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port' + port);
});
