const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true},

genres: { 
    name: String,
    description: String, 
},

director: {
    name: String,
    bio: String,
    birthyear: String,
},

actors: [String],
imagePath: String,
featured: Boolean

}); 

let userSchema = mongoose.Schema({
    username: {type: String, required: true}, 
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthyear: { type: String, required: false},
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', default:[]}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10); 
}; 

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);


module.exports.Movie = Movie;
module.exports.User = User; 