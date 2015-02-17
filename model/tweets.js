var mongoose = require('mongoose');  
var tweetSchema = new mongoose.Schema({  
  body: String,
  tweetid: String,
  avatar: String,
  screenName: String,
  date: { type: Date, default: Date.now }
});
mongoose.model('Tweet', tweetSchema); 