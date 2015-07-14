bourbonTweetAlerts
======================
A webapp written in Node.js to log and send SMS messages when certain twitter accounts mention a keyword such as 'bourbon'

## Description
There are certain twitter accounts to follow so you know when a product is available for sale. Any good bourbon sells out in record time, so this is an effort to be on the edge. However, you don't want to get notifications for their every tweet. Instead, this is a way to filter out those tweets and recieve notifications via SMS when a certain keyword exists. 

## Deployment
The webapp is almost ready to go out of the box. A few environment variables need to be created. At the root of the project folder, create a file names `secrets.json`. You will need twitter API keys and a Google Voice account.

`secrets.json`
```
{
  	"twitter_consumer_key": "87f********",
	"twitter_consumer_secret": "QW53********",
	"twitter_access_token": "288734********",
	"twitter_access_token_secret": "EYpS********",
	"gv_email" : "me@gmail.com",
	"gv_password" : "myGmailPw",
	"my_number" : "5555555555",
  "my_carrier" : "AT&T" (look up the https://github.com/regality/sms-address/blob/master/carriers.json for carriers)
}
```

- **Run bourbonTweetAlerts on a standalone server or docker container**
  - make sure Node.js and NPM are installed.
  - Clone this git repository and add the `secrets.json` file. 
  - Run `npm install` to make sure all the dependencies are there. 
  - Within the `db.js` file in the model folder, change the `mongoose.connect` location under the `local or prod` note to your running MongoDB instance. 
  - Proceed on with however you deploy your Node.js apps to production.

- **Run bourbonTweetAlerts on Cloud Foundry**
  - create a MongoDB service from the Cloud Foundry services menu
  - modify `manifest.yml` and add it to the binded services. Change name, domain, and Memory size to suit.
  - Within the `db.js` file in the model folder, change the service url in `appEnv.getServiceURL('kcoleman-bourbonTweetAlerts-mongo')` the name specified from the first step that was also added to `manifest.yml`.
  - `cf push bourbonTweetAlerts`

## Contribution
- Fork it, merge it

Licensing
---------
Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Support
-------
Please file bugs and issues at the Github issues page.