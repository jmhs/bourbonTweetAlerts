var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Twit = require('twit'),
	es6 = require('es6-shim'),
	fs    = require('fs'),
    nconf = require('nconf');
    voicejs = require('voice.js');
/* GET home page. */
router.get('/', function(req, res, next) {
	mongoose.model('Tweet').find({}).sort({_id: -1}).exec(function (err, tweets) {
	  	if (err) return console.error(err);
	  	res.render('index', {
	  		title: 'Filtered Bourbon Tweets',
	  		"tweets" : tweets
	  	});
	});
});

/* GET New User page. */
router.get('/newtweet', function(req, res) {
    res.render('newtweet', { title: 'Add New Tweet' });
});

/* POST to Add User Service */
router.post('/addtweet', function(req, res) {
    // Get our form values. These rely on the "name" attributes
    var tweetBody = req.body.tweetbody;
    var tweetID = req.body.tweetid;
    var messageSent = req.body.messagesent;

    mongoose.model('Tweet').create({
    	tweetbody: tweetBody,
    	tweetid : tweetID,
    	messageSent: messageSent
    }, function (err, tweetID) {
	  if (err) {
	  	//return handleError(err);
	  	res.send("There was a problem adding the information to the database.");
	  } 
	  else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("tweets");
            // And forward to success page
            res.redirect("index");
       }
	  // saved!
	})
});

nconf.file('secrets.json');
var twitter_consumer_key = nconf.get('twitter_consumer_key'),
    twitter_consumer_secret = nconf.get('twitter_consumer_secret'),
    twitter_access_token = nconf.get('twitter_access_token'),
    twitter_access_token_secret = nconf.get('twitter_access_token_secret'),
    gv_email = nconf.get('gv_email'),
    gv_password = nconf.get('gv_password'),
    my_number = nconf.get('my_number');

var T = new Twit({
    consumer_key:         twitter_consumer_key
  , consumer_secret:      twitter_consumer_secret
  , access_token:         twitter_access_token
  , access_token_secret:  twitter_access_token_secret
});

var stream = T.stream('statuses/filter', { 
	follow: ['216442829', '2887341'] 
});

var keywords = ['bourbon', 'whiskey', 'whisky', 'rye', 'buffalo', 'parkers', "parker's", 
				'weller', 'sazerac', 'eagle', 'rare', 'w.l.', 'Sour Mash', 'pappy', 'winkle', 
				'Bourbon', 'Whiskey', 'Whisky', 'Rye', 'Buffalo', 'Parker', 'Weller', 
				'Sazerac', 'Thomas', 'Pappy', 'Winkle', 'W.L.', 'sour mash', "Parker's", 'Elijah',
				'BTAC', 'btac'];

var gvclient = new voicejs.Client({
	email: gv_email,
	password: gv_password
});

stream.on('tweet', function (tweet) {
	console.log('New tweet in the queue... ' + tweet.user.screen_name + ': ' + tweet.text);
	console.log(tweet);
	var body = tweet.text,
		tweetid = tweet.id_str,
		avatar = tweet.user.profile_image_url
		screenName = tweet.user.screen_name;

	//we don't want any RTs
	if (tweet.retweeted_status == undefined){
		//loop the keywords
		keywords.forEach(function(keyword) { 
	  		//If the tweet contains one of the keywords...
	  		if (tweet.text.includes(keyword) == true){
	  			//send a text message through google voice
	  			gvclient.sms({ to: my_number, text: tweet.user.screen_name + ': ' + tweet.text}, function(err, res, data){
					if(err){
						return console.log(err);
					}
					//console.log('SMS "' + '" sent to' + '. Conversation id: ', data.send_sms_response.conversation_id);
				});
				//add it to the database
	  			mongoose.model('Tweet').create({
			    	body: body,
			    	tweetid : tweetid,
			    	avatar: avatar,
	  				screenName: screenName,
	  				date: Date.now
			    }, function (err, tweetid) {
				  if (err) {
				  	//return handleError(err);
				  	//res.send("There was a problem adding the information to the database.");
				  	console.log("There was a problem adding the information to the database.");
				  } 
				  else {
			            // If it worked, set the header so the address bar doesn't still say /adduser
			            //res.location("tweets");
			            // And forward to success page
			            //res.redirect("tweets");
			            console.log("Added TweetID: " + tweetid + " to the database");
			       }
				  // saved!
				})
	  		}
	  	})
	}
})


module.exports = router;