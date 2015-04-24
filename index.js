var express = require('express');
var _  = require('lodash');
var shortId = require('shortid')
var config = require('./config');


var ObjectId = require('mongoose').Types.ObjectId

var fixtures = require('./fixtures');


var app = express()

require('./middleware')(app);

require('./router')(app);

app.get('*', function (req, res) {
  res.status(404).send('Not found!')
})



var server = app.listen(config.get('server:port'),config.get('server:host'));

server.on('listening',function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

module.exports = server;