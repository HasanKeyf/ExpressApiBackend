var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var User = new Schema({
    id:{
        type:String,
        unique: true
    },

    name: String,
    email: {
        type:String,
        unique: true
    },

    password: String,

    followingIds:{type:[String] , default:[]}


});

User.pre('save', function (next) {
    var user = this;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    //var hash = bcrypt.hash(user.password, 8)
    user.password = hash;
    next();
});

User.methods.toClient = function () {

    return {
        id: this.id,
        name: this.name
    }

};

User.statics.findByUserId = function(id, done) {
    this.findOne({ id: id }, done)
}

User.methods.follow = function(userId, done) {
    var update = { $addToSet: { followingIds: userId } }
    this.model('User').findByIdAndUpdate(this._id, update, done)
}

User.methods.unFollow = function(userId, done) {
    var update = { $pull: { followingIds: userId } }
    this.model('User').findByIdAndUpdate(this._id, update, done)
}

User.methods.getFriends = function(done) {
    this.model('User').find({id: {$in: this.followingIds}}, done)

}



User.methods.getFollowers = function(done) {
    this.model('User').find({followingIds: {$in: [this.id]}}, done)
}


module.exports = User