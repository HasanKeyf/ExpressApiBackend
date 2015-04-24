var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tweet = new Schema({


    userId: String,
    created:Number,
    text: String





});

Tweet.methods.toClient = function () {

    return {
        id: this._id,
        text: this.text,
        created: this.created,
        userId: this.userId
    }

};



module.exports = Tweet