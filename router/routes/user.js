var express = require('express')
    , router = express.Router();
var conn = require('../../db');
var User = conn.model('User');
var Tweet = conn.model('Tweet');
var ensureAuthentication = require('../../middleware/ensureAuthentication');

router.post('/:userId', function (req, res) {
    var id = req.params.userId;

    /* var user = _.find(fixtures.users, function (u) {
     return u.id == id;
     });*/
    var update = {password:req.body.password};

    User.findOneAndUpdate({ id:id },update,null, function (err, user) {
        if (err) {
            res.status(500).send("An error occured!");
        }
        if (user) {
            res.status(200).send({user: user.toClient()});
        }
        else{
            res.status(404).send('User Not Found');
        }
    })


})

router.get('/:userId', function (req,res) {

    var id = req.params.userId;

    /* var user = _.find(fixtures.users, function (u) {
     return u.id == id;
     });*/
    User.findOne({ id:id }, function (err, user) {
        if (err) {
            res.status(500).send("An error occured!");
        }


        if (user) {
            res.status(200).send({user: user.toClient()});
        }
        else{
            res.status(404).send('User Not Found');
        }
    })

});

router.post('/', function (req,res) {

    var userToAdd =JSON.parse(JSON.stringify(req.body.user));


    //console.log(userToAdd);
    /*  // var userE = _.find(fixtures.users, function (u) {
     return u.id == userToAdd.user.id;
     });*/
    //save to fixture
    /* if (userE) {
     res.status(409).send('Conflict');
     }
     else{

     userToAdd.user.followingIds = [];
     fixtures.users.push(userToAdd.user);

     req.login(userToAdd.user, function(err) {
     if (err) {
     console.log(err);
     return res.sendStatus(500)
     }

     })

     res.status(200).send({ user: userToAdd.user })
     }*/

    //save to db

    User.create(userToAdd, function(err, user) {
        if (err) {
            var code = err.code === 11000 ? 409 : 500
            return res.sendStatus(code)
        }
        req.login(user, function(err) {
            if (err) {
                return res.sendStatus(500)
            }
            res.sendStatus(200)
        })
    })

});

router.post('/:userId/follow',ensureAuthentication, function (req,res) {
    var userId = req.params.userId;

   User.findByUserId(userId, function (err,user) {
       if (err) {
           return res.sendStatus(500);
       }
       if (!user) {
           return res.sendStatus(403);
       }

       req.user.follow(userId, function (err) {
           if (err) {
               return res.sendStatus(500);
           }

           res.sendStatus(200);

       })


   })
})

router.post('/:userId/unfollow',ensureAuthentication, function (req,res) {
    var userId = req.params.userId;

    User.findByUserId(userId, function (err,user) {
        if (err) {
            return res.sendStatus(500);
        }
        if (!user) {
            return res.sendStatus(403);
        }

        req.user.unFollow(userId, function (err) {
            if (err) {
                return res.sendStatus(500);
            }

            res.sendStatus(200);

        })


    })
})

router.get('/:userId/friends', function(req, res) {
    var userId = req.params.userId;

    User.findByUserId(userId, function(err, user) {
        if (err) {
            return res.sendStatus(500)
        }
        if (!user) {
            return res.sendStatus(404)
        }
        user.getFriends(function(err, friends) {
            if (err) {
                return res.sendStatus(500)
            }
            var friendsList = friends.map(function(user) { return user.toClient() })
            res.send({ users: friendsList })
        })
    })
})


router.get('/:userId/followers', function(req, res) {
    var userId = req.params.userId;

    User.findByUserId(userId, function(err, user) {
        if (err) {
            return res.sendStatus(500)
        }
        if (!user) {
            return res.sendStatus(404)
        }
        user.getFollowers(function(err, followers) {
            if (err) {
                return res.sendStatus(500)
            }
            var followersList = followers.map(function(user) { return user.toClient() })
            res.send({ users: followersList })
        })
    })
})



//unfollow
module.exports = router;