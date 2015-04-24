var express = require('express')
    , router = express.Router();
var ensureAuthentication = require('../../middleware/ensureAuthentication');

var conn = require('../../db');
var User = conn.model('User');
var Tweet = conn.model('Tweet');

router.get('/', ensureAuthentication, function(req, res) {
    var  stream = req.query.stream
        , userId = req.query.userId
        , options = { sort: { created: -1 } }
        , query = null


    if (stream === 'home_timeline') {
        query = { userId: { $in: req.user.followingIds }}
    } else if (stream === 'profile_timeline' && userId) {
        query = { userId: userId }
    } else {
        return res.sendStatus(400)
    }

    Tweet.find(query, null, options, function(err, tweets) {
        if (err) {
            return res.sendStatus(500)
        }
        var responseTweets = tweets.map(function(tweet) { return tweet.toClient() })
        res.send({ tweets: responseTweets })
    })
})

router.get('/:tweetId', function (req,res) {
    var  id = req.params.tweetId;

    // var tweet = _.find(fixtures.tweets, 'id',req.params.tweetId);

    Tweet.findById(id, function (err, tweet) {
        if (err) {
            return res.status(500).send(err.message);
        }

        if(!tweet){
            return  res.status(404).send('!not found');
        }
        res.status(200).send({tweet:tweet.toClient()});
    })



});

router.delete('/:tweetId',ensureAuthentication, function (req,res) {
    // var tweet = _.find(fixtures.tweets, 'id', req.params.tweetId);
    var id = req.params.tweetId;

    if (!ObjectId.isValid(id)) {
        return res.sendStatus(400)
    }

    Tweet.findById(id, function (err, tweet) {
        if (!tweet) {
            return res.sendStatus(404);
        }


        if(tweet.userId == req.user.id)
        {
            if(!tweet){
                return res.status(404).send('!not found');
            }else{
                //_.remove(fixtures.tweets,tweet);
                Tweet.findByIdAndRemove(id, function (err, tw) {
                    if (err) {
                        return res.status(500).send('!error');
                    }

                    return res.status(200).send({tweet:tw.toClient()});

                })
            }
        }

        else{
            return res.sendStatus(403);
        }

    })





});

router.post('/',ensureAuthentication, function (req,res) {
    var tweetToAdd =req.body.tweet;
    tweetToAdd.created = Date.now()/1000

    tweetToAdd.userId =req.user.id
    Tweet.create(tweetToAdd, function (err,tweet) {
        if (err) {
           return res.status(500).send('An error occurred while saving!');

        }else{
            console.log("added : "+tweet);
           return res.status(200).send({tweet:tweet.toClient()});
        }

    });


    /*    console.log(tweetToAdd);
     tweetToAdd.id=shortId.generate();
     tweetToAdd.created = Date.now()/1000;
     console.log(Date.now());
     fixtures.tweets.push(tweetToAdd);
     res.status(200).send({tweet:tweetToAdd});*/


});

module.exports = router;