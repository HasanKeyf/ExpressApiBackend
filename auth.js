var passport = require('passport')
var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy
var fixtures = require('./fixtures');
var conn = require('./db')
var User = conn.model('User')

var _  = require('lodash');


function verify(username, password, done) {

    User.findOne({ id: username }, function(err, user) {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' })
        }
        bcrypt.compare(password, user.password, function(err, matched) {
            if (err) {
                return done(err)
            }
            matched ? done(null, user)
                : done(null, false, { message: 'Incorrect password.' })
        })
    })
  // var user = _.find(fixtures.users, 'id', username)


}

passport.use(new LocalStrategy(verify))

passport.serializeUser(function(user, done) {

    done(null, user.id);
});

passport.deserializeUser(function(id, done) {

   // var user = _.find(fixtures.users, 'id', id);

     User.findOne({ id:id }, function (err, user) {
        if(user){
            done(null,user);
        }
        else{
            done(null, false);
        }
    });



});



module.exports = passport