// app.METHOD(PATH, HANDLER)
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("'mongodb://localhost:27017/myFlixDB'", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




const express = require("express");
const morgan = require("morgan");
uuid = require("uuid");
const app = express();

const cors = require('cors');
app.use(cors());

const passport = require("passport");
require("./passport.js");

const { check, validationResult } = require('express-validator');



app.use(express.urlencoded({ extended: true }));
let auth = require("./auth.js")(app);

app.use(express.json());
app.use(morgan("common"));
app.use(express.static("public"));



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});


app.get("/", (req, res) => {
    res.send("Welcome");
});

// Main Page

app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
});

//Index Page

app.get("/documentation", (req, res) => {
    res.send("public/documentation");
});

// API CALLS TABLE PAGE

app.get("/apicalls", (req, res) => {
    res.send("public/apicalls");
});

// Get List of All Movies

app.get("/movies", passport.authenticate('jwt',
    { session: false }), (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(201).send(movies);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

// Gets data for one movie by id

app.get("/movies/:title", passport.authenticate('jwt',
    { session: false }), (req, res) => {
        Movies.findOne({ title: req.params.title })
            .then((movie) => {
                res.send(movie);
            });
    });

// Gets data about the director

app.get("/movies/:id/director", passport.authenticate('jwt',
    { session: false }), (req, res) => {
        Movies.findById(req.params.id)
            .then((movie) => {
                res.send(movie.director);
            });
    });

// Gets data about the genre

app.get("/movies/:id/genres", passport.authenticate('jwt',
    { session: false }), (req, res) => {
        Movies.findById(req.params.id)
            .then((movie) => {
                res.send(movie.genres);
            });
    });

// Add a movie

app.post("/movies", passport.authenticate('jwt',
    { session: false }), (req, res) => {
        Movies.findOne({ title: req.params.title })
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
    { session: false }), (req, res) => {
        Movies.findOneAndRemove({ title: req.params.title })
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
    { session: false }), (req, res) => {
        Users.find()
            .then((users) => {
                res.send(users);
            })
    });

// Gets one user by username

app.get("/users/:username", passport.authenticate('jwt',
    { session: false }), (req, res) => {
        Users.findOne({ username: req.params.username })
            .then((user) => {
                console.log(user);
                res.send(user);
            })
    });

// Allows new User to be added

app.post("/users", 
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOne({ username: req.body.username })

            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.username + " already exists");
                } else {
                    Users
                        .create({
                            username: req.body.username,
                            password: req.body.password,
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
        { session: false }), (req, res) => {
            Users.findOne({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        res.status(400).send(req.params.username + " was not found");
                    } else {
                        user.set(req.body);
                        user.save((updatedUser) => {
                            res.send({ data: updatedUser });
                        })
                    }
                })
        });
    

    // Allows users to add movie list

    app.post("/users/:userId/movies/:movieId", passport.authenticate('jwt',
        { session: false }), (req, res) => {
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
        { session: false }), (req, res) => {
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
        { session: false }), (req, res) => {
            Users.findOneAndRemove({ username: req.params.username })
                .then((user) => {
                    if (!user) {
                        res.status(400).send(req.params.username + " was not found.");
                    } else {
                        res.send(req.params.username + " was deleted.");
                    }
                })
        });


});


const port = process.env.PORT || 8080; 
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on port' + port);
}); 