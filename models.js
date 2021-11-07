const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    director: {type: mongoose.Schema.Types.ObjectId, ref: 'Director'},
    genres: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genres', default: []}],
    actors: [String],
    imagePath: {type: String, required: false},
    featured: {type: Boolean, required: false}
});

let genreSchema = mongoose.Schema( {
    name: {type: String, required: true},
    description: { type: String, required: true },
});

let directorSchema = mongoose.Schema( {
    name: {type: String, required: true},
    bio: {type: String, required: true},
    birthyear: {type: String, required: true},

});



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