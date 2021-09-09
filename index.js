// app.METHOD(PATH, HANDLER)

const express = require('express');
const { add } = require('lodash');
const morgan = require('morgan');
const { id } = require('process');
uuid = require('uuid');
const app = express();

let users = [
    {
        id: 1,
        name: 'Naomi',
        username: 'FirstUser',
        email: 'nrrodrig@gmail.com',
        movies: [1, 2]
    }
];


let movies = [
    {
        id: 1,
        title: 'Embrace of the Serpent',
        description: 'This is a foreign film',
        director: 'Ciro Guerra',
        genre: 'Drama',
        featured: '',
        image: 'goes here'

    },
    {

        id: 2,
        title: 'Jojo Rabbit',
        description: '',
        director: 'Taika Waititi',
        genre: '',
        featured: '',
        image: 'goes here'

    },
    {
        id: 3,
        title: 'The Darjeeling Limited',
        description: '',
        director: 'Wes Anderson',
        genre: '',
        featured: '',
        image: 'goes here'

    },
    {

        id: 4,
        title: 'Get Out',
        description: '',
        director: 'Jordan Peele',
        genre: '',
        featured: '',
        image: 'goes here'

    },
    {
        id: 5,
        title: 'Hereditary',
        description: '',
        director: 'Ari Aster',
        genre: '',
        featured: '',
        image: 'goes here'


    },
    {
        id: 6,
        title: 'Midsommar',
        description: '',
        irector: 'Ari Aster',
        genre: '',
        featured: '',
        image: 'goes here'
    },
    {
        id: 7,
        title: 'Princess Mononoke',
        description: '',
        director: 'Hayao Miyazaki',
        genre: '',
        featured: '',
        image: 'goes here'


    },
    {
        id: 8,
        title: 'Akira',
        description: '',
        director: 'Katsuhiro Otomo',
        genre: '',
        featured: '',
        image: 'goes here'

    },

    {
        id: 9,
        title: 'Paprika',
        description: '',
        director: 'Satoshi Kon',
        genre: '',
        featured: '',
        image: 'goes here'


    },
    {
        id: 10,
        title: 'Blade Runner',
        description: '',
        director: 'Ridley Scott',
        genre: '',
        featured: '',
        image: 'goes here'



    },
    {
        id: 11,
        title: 'Aliens',
        description: '',
        director: 'Ridley Scott',
        genre: '',
        featured: '',
        image: 'goes here'


    },
];

// Movie Validation and Adding functions

function validateMovie(req, res, next) {
    let movie = req.body;
    let errors = [];

    if (!movie.title) {
        errors.push("Title is required");
    }

    if (!movie.description) {
        errors.push("Description is required");
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
    } else {
        next();
    }
}


function addMovie(movie) {
    let newMovie = movie;
    newMovie.id = uuid.v4();
    movies.push(newMovie);

}



app.use(express.json());

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

app.get('/', (req, res) => {
    res.send('Welcome');
});

// Main Page

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});






// Get List of All Movies

app.get('/movies', (req, res) => {
    res.json(movies);
});

// Gets data for one movie by id

app.get('/movies/:id', (req, res) => {
    res.json(movies.find((movie) => { return movie.id == req.params.id }));
});

// Gets data about the director

app.get('/movies/:id/director', (req, res) => {
    const movie = movies.find((movie) => { return movie.id == req.params.id });

    if (movie) {
        if (movie.director) {
            res.json(movie.director);
        } else {
            res.status(404).send(`Director of ${movie.id} does not exist`)
        }
    } else {
        res.status(404).send(`${req.params.id} not found`)
    }
});


// Gets data about the genre

app.get('/movies/:id/genre', (req, res) => {
    const movie = movies.find((movie) => { return movie.id == req.params.id; });

    if (movie) {
        if (movie.genre) {
            res.json(movie.genre);
        } else {
            res.status(404).send('Genre not found');
        }
    } else {
        res.status(404).send(`Movie not found`)
    }
});

// Add a movie 

app.post('/movies', validateMovie, (req, res) => {
    addMovie(req.body, res);

});

// Remove a Movie from movie list 


app.delete('/movies/:id', (req, res) => {
    let movies = movies.find((movie) => {
        return movie.id == req.params.id
    });

    if (movie) {
        movies = movies.filter((_movie) => {
            return _movie.id != req.params.id
        });
        res.status(201).send(`Movie with ${req.params.id} was deleted`);
    } else {
        res.status(404).send(`Movie not found`);
    }
});


// USERS RES AND REQ START HERE 

app.post('/users', (req, res) => {
    let newUser = req.body;
    console.log(newUser);

    if (!newUser) {
        let message = 'All User Fields Required'
        return res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(`User ${newUser.name} was succesfully created`);
    }
});

// Allows Users to update Profile 


app.patch('/users/:id/username', (req, res) => {
    const username = req.body.username
    if (username) {
        const user = users.find((user) => {
            return user.id == req.params.id;
        });

        if (user) {
            user.username = req.body.username
            res.status(200).send(user);
        } else {
            res.status(404).send(`User not found`);
        }

    } else {
        res.status(400).send(`Username not provided`)
    }
});




// Allows users to add movie list

app.put('/users/:id/movies', validateMovie, (req, res) => {
    const user = users.find((user) => {
        return user.id == req.params.id;
    });


    if (user) {
        const movie = movies.find((movie) => {
            return movie.id == req.body.id;
        });

        if (!movie) {
            addMovie(req.body, res);
        } // Adds movie if movie does not already exist 

        user.movies.push(req.body.id);
        res.status(201).send(`${req.body.id} was added to ${user.name} movie list`);

    } else {
        res.status(404).send(`User not found`);
    }
});


// Allows user to delete movie 

app.delete('/users/:id/movies/:id', (req, res) => {
    const user = users.find((user) => {
        return user.id == req.params.id;
    });
    if (user) {
        const movie = movies.find((movie) => {
            return movie.id == req.params.id;

        });

        if (movie) {
            movies = movies.filter((_movie) => {
                return _movie.id != req.params.id
            });
            res.status(200).send(`Movie with id:${req.params.id} was deleted`);
        } else {
            res.status(404).send(`Movie not found`);
        }
    } else {
        res.status(404).send(`User not found`);
    }
});

// Allows user to deregister 

app.delete('/users/:id', (req, res) => {
    const user = users.find((user) => {
        return user.id == req.params.id;
    });

    if (user) {
        users = users.filter((_user) => {
            return _user.id != req.params.id;
        });

        return res.status(200).send(`User with ${req.params.id} was deleted`);

    } else {
        res.status(404).send(`User not found`);
    }
});

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});

