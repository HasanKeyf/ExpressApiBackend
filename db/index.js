var mongoose = require('mongoose')
var config = require('../config')
var User =  require(__dirname+'/schemas/user')
var Tweet  =  require(__dirname+'/schemas/tweet')


var connection = mongoose.createConnection(config.get('database:host'), config.get('database:name'), config.get('database:port'))
console.log(config.get('database:name'));

connection.model('User',User);
connection.model('Tweet',Tweet);

module.exports = connection