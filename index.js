// app.METHOD(PATH, HANDLER)

const express = require('express'),
    morgan = require('morgan');
    uuid = require('uuid'); 
const app = express();



const topMovies = [{
        id: 1,
        title: 'Embrace of the Serpent',
        description: '' ,
        director: 'Ciro Guerra',
        genre:  '',
        featured: '',
        image: 'goes here'

    },
    {

        id: 2,
        title: 'Jojo Rabbit',
        description: '',
        director: 'Taika Waititi',
        genre: '' ,
        featured: '' ,
        image: 'goes here'
        
    },
    {
        id: 3,
        title: 'The Darjeeling Limited',
        description: '',
        director: 'Wes Anderson',
        genre: '',
        featured: '' ,
        image: 'goes here'
        
    },
    {

        id: 4,
        title: 'Get Out', 
        description: '',
        director: 'Jordan Peele',
        genre: '',
        featured: '' ,
        image: 'goes here'
        
    },
    {
        id: 5,
        title: 'Hereditary', 
        description: '',
        director: 'Ari Aster',
        genre: '',
        featured: '' ,
        image: 'goes here'
        
        
    },
    {
        id: 6,
        title: 'Midsommar',
        description: '',
        irector: 'Ari Aster'
        genre: '',
        featured: '' ,
        image: 'goes here'
    },
    {
        id: 7,
        title: 'Princess Mononoke', 
        description: '',
        director: 'Hayao Miyazaki',
        genre: '',
        featured: '' ,
        image: 'goes here'
       
        
    },
    {   
        id: 8,
        title:'Akira',
        description: '',
        director: 'Katsuhiro Otomo'
        genre: '',
        featured: '' ,
        image: 'goes here'
        
    },

    {
        id: 9,
        title: 'Paprika',
        description: '',
        director: 'Satoshi Kon'
        genre: '',
        featured: '' ,
        image: 'goes here'
       
        
    },
    {
        id: 10,
        title: 'Blade Runner', 
        description: '',
        director: 'Ridley Scott',
        genre: '',
        featured: '' ,
        image: 'goes here'
       
       
       
    },
    {
        id: 11,
        title: 'Aliens', 
        description: '',
        director: 'Ridley Scott',
        genre: '',
        featured: '' ,
        image: 'goes here'
       
        
    },
];


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
    res.sendFile('public/documentation.html', { root: __dirname});
});

// Get List of All Movies

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Gets data for one movie by title

app.get('/movies/[id]/:title', (req, res) => {
    res.json(movies.find((movie) => 
    { return movie.title === req.params.title}));
});

// Gets data about the director

app.get('/movies/[id]/:director', (req, res) => {
    res.json(movies.find((director) =>
{ return movie.director === req.params.director})); 
});


app.get('/genres')












// USERS RES AND REQ START HERE 



app.listen(8080, () => {
    console.log('App is listening on port 8080');
});

