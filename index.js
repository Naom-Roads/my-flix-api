// app.METHOD(PATH, HANDLER)

const express = require('express'),
    morgan = require('morgan');
const app = express();


const topMovies = [{
        title: 'Embrace of the Serpent',
        director: 'Ciro Guerra'

    },
    {
        title: 'Jojo Rabbit',
        director: 'Taika Waititi'
    },
    {
        title: 'The Darjeeling Limited',
        director: 'Wes Anderson'
    },
    {
        title: 'Get Out', 
        director: 'Jordan Peele'
    },
    {
        title: 'Hereditary', 
        director: 'Ari Aster'
    },
    {
        title: 'Midsommar',
        director: 'Ari Aster'
    },
    {
        title: 'Princess Mononoke', 
        director: 'Hayao Miyazaki'
    },
    {
        title:'Akira',
        director: 'Katsuhiro Otomo'
    },
    {
        title: 'Paprika',
        director: 'Satoshi Kon'
    },
    {
        title: 'Blade Runner', 
        director: 'Ridley Scott'
    },
    {
        title: 'Aliens',
        director: 'Ridley Scott'
    },
    {
        title: 'The Shinning',
        director: 'Stanley Kubrick'
    },
    {
        title: 'Apocolypse Now',
        director: 'Francis Ford Coppola'
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

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});