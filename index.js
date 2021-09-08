// app.METHOD(PATH, HANDLER)

const express = require('express'),
    morgan = require('morgan');
const { title } = require('process');
uuid = require('uuid');
const app = express();



const topMovies = [{
    id: 1,
    title: 'Embrace of the Serpent',
    description: '',
    director: 'Ciro Guerra',
    genre: '',
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
    irector: 'Ari Aster'
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
    director: 'Katsuhiro Otomo'
        genre: '',
    featured: '',
    image: 'goes here'

},

{
    id: 9,
    title: 'Paprika',
    description: '',
    director: 'Satoshi Kon'
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

function addMovie(body, res) {
    let newMovie = body;

    if (!newMovie.title) {
        const message = "Missing Title in request body";
        res.status(400).send(message);
    } else {
        newMovie.id = uuid.v4();
        movies.push(newMovie);
        res.status(201).send(newMovie);
    }

}


app.use(express.urlencoded({
    extended: true
}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err);
});

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// Get List of All Movies

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Gets data for one movie by title

app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => { return movie.title === req.params.title }));
});

// Gets data about the director

app.get('/movies/:title/director', (req, res) => {
    const movie = movies.find((movie) => { return movie.title === req.params.title });

    if (movie) {
        if (movie.director) {
            res.json(movie.director);
        } else {
            res.status(404).send(`Director of ${movie.title} does not exist`)
        }
    } else {
        res.status(404).send(`${req.params.title} not found`)
    }
});


// Gets data about the genre

app.get('/genres/:name', (req, res) => {
    const genre = genres.find((genre) => { return genre.name === req.params.name })

    if (genre) {
        res.json(genre);
    } else {
        res.status(404).send('Genre not found')
    }
});

// Add a movie 

app.post('/movies', (req, res) => {
    addMovie(req.body, res);

});

// Remove a Movie from movie list 


app.delete('/movies/:id', (req, res) => {
    let movies = movies.find((movie) => {
        return movie.id === req.params.id
    });

    if (movie) {
        movies = movies.filter((_movie) => {
            return _movie.id !== req.params.id
        });
        res.status(201).send(`Movie with ${req.params.id} was deleted`)
    }
});


// USERS RES AND REQ START HERE 

app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        let message = 'Name required'
        return res.status(400).send(message);
    }
    if (!newUser.email) {
        let message = 'Email Required'
        return res.satus(400).send(message);
    }

    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);

});

// Allows Users to update Profile 



// Allows users to update movie list

app.put('/users/:id/movies', (req, res) => {
    const user = users.find((user) => {
        return user.id === req.params.id;
    });
    if (!req.body.title) {
        const message = 'Missing movie title in request body';
        return res.status(400).send(message);
    }
   
    if (user) {
        const movie = movies.find((movie) => {
            return movie.title === req.body.title;
        });
    
        if (!movie) {
            addMovie(req.body, res); 
        } // Adds movie if movie does not already exist to happen in the background 
    
        user.movies.push(req.body.title);
        res.status(201).send(`${req.body.title} was added to ${user.name} movie list`);

    } else {
        res.status(404).send(`User not found`);
    }
});


app.listen(8080, () => {
    console.log('App is listening on port 8080');
});

