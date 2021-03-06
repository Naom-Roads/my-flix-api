const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 *  This is creating a new schema for the movie.
 * @typedef {Object} Movie
 * @property {string} title
 * @property {string} description
 * @property {Object} director
 * @property {array} genres
 */
let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    director: {type: mongoose.Schema.Types.ObjectId, ref: 'Director'},
    genres: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genres', default: []}],
    actors: [String],
    imagePath: {type: String, required: false},
    featured: {type: Boolean, required: false}
});

/**
 *  This is creating a new schema for the genre.
 *  @typedef {{name: string, description: string}}
 */

let genreSchema = mongoose.Schema( {
    name: {type: String, required: true},
    description: { type: String, required: true },
});

/**
 * This is creating a new schema for the director.
 * @typedef {{name: string, bio: string, birthyear: string}} Director
 */

let directorSchema = mongoose.Schema( {
    name: {type: String, required: true},
    bio: {type: String, required: true},
    birthyear: {type: String, required: true},

});

/**
 * This is creating a new schema for the user.
 * @typedef {Object} User
 * @property {string} username
 * @property {string} password
 * @property {string} email
 * @property {string} birthyear
 * @property {array} favoriteMovies
 *
 */
let userSchema = mongoose.Schema({
    username: {type: String, required: true}, 
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthyear: { type: String, required: false},
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'favoriteMovies', default:[]}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10); 
}; 

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);


module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
module.exports.Genre = Genre;