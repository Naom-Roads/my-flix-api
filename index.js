// app.METHOD(PATH, HANDLER)
const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");
uuid = require("uuid");

const mongoose = require("mongoose");
const express = require("express");
const Models = require("./models.js");

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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

// Main Page


app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", {root: __dirname});
});

// API CALLS TABLE PAGE

app.get("/apicalls", (req, res) => {
    res.send("public/apicalls");
});

// Get List of All Movies
app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets movie by title
app.get("/movies/:title", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Movies.findOne({title: req.params.title})
        .then((movie) => {
            res.send(movie);
        });

});

// Gets data for one movie by id

app.get("movies/genres/:genreId", passport.authenticate('jwt',
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

app.get("movies/directors/:directorId", passport.authenticate('jwt',
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




// Gets data about the director

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


// Gets data about the genre

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

// Gets all genres

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

// Gets list of existing users

app.get("/users", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.send(users);
        })
});

// Gets one user by username

app.get("/users/:username", passport.authenticate('jwt',
    {session: false}), (req, res) => {
    Users.findOne({username: req.params.username})
        .then((user) => {
            console.log(user);
            res.send(user);
        })
});

// Allows new User to be added

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
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send("Error: " + error);
                        });
                }
            });


        // Allows Users to update Profile

        app.patch("/users/:username", passport.authenticate('jwt',
            {session: false}), (req, res) => {
            Users.findOne({username: req.params.username})
                .then((user) => {
                    if (!user) {
                        res.status(400).send(req.params.username + " was not found");
                    } else {
                        user.set(req.body);
                        user.save((updatedUser) => {
                            res.send({data: updatedUser});
                        })
                    }
                })
        });


        // Allows users to add movie list

        app.post("/users/:userId/movies/:movieId", passport.authenticate('jwt',
            {session: false}), (req, res) => {
            Users.findById(req.params.userId)
                .then((user) => {
                    if (!user) {
                        return res.status(404).send("User does not exist")
                    }
                    if (user.favoriteMovies && !user.favoriteMovies.includes(req.params.movieId)) {

                        user.favoriteMovies.push(req.params.movieId)
                        user.save(() => {
                            res.send(req.params.movieId + "Movie was added to Favorites")

                        })
                    } else {
                        res.send("Movie is already added");
                    }
                });
        });


        // Allows user to delete movie

        app.delete("/users/:userId/movies/:movieId", passport.authenticate('jwt',
            {session: false}), (req, res) => {
            Users.findById(req.params.userId)
                .then((user) => {
                    if (!user) {
                        return res.status(404).send("User does not exist")
                    }
                    if (user.favoriteMovies && user.favoriteMovies.includes(req.params.movieId)) {
                        user.favoriteMovies.remove(req.params.movieId)
                        user.save(() => {
                            res.send(req.params.movieId + "Movie was removed from Favorites")
                        })
                    } else {
                        res.send("Movie was not found");
                    }
                });
        });

        // Allows user to deregister

        app.delete("/users/:username", passport.authenticate('jwt',
            {session: false}), (req, res) => {
            Users.findOneAndRemove({username: req.params.username})
                .then((user) => {
                    if (!user) {
                        res.status(400).send(req.params.username + " was not found.");
                    } else {
                        res.send(req.params.username + " was deleted.");
                    }
                })
        });


    });


const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port' + port);
});