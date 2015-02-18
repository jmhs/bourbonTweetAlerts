var mongoose = require('mongoose'),
	cfenv = require("cfenv");

var appEnv = cfenv.getAppEnv()
var mongoLabUrl = appEnv.getServiceURL('kcoleman-bourbonTweetAlerts-mongo');
if (mongoLabUrl == null) {
	//local or prod development
	mongoose.connect('mongodb://localhost/bourbonTweetAlerts');
} else {
	//cloud foundry
	mongoose.connect(mongoLabUrl);
}
