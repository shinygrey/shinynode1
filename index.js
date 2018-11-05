var http = require('http');
var https = require('https');
var browsermessage = " "
const crypto = require('crypto');

const {Twitter} = require("../app/twitter.js");

const envGreg = process.env.GREG_VAR;
const envProtocol = process.env.REQUEST_PROTOCOL;
const envRequestUrl = process.env.REQUEST_URL;
const oauthConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const oauthAccessToken = process.env.TWITTER__ACCESS_TOKEN;
const oauthConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const oauthAccessTokenSecret = process.env.TWITTER__ACCESS_TOKEN_SECRET;


var urlUserTimeline = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
var twitterurl = encodeURIComponent(urlUserTimeline);
var method = "GET";
var oauthParams = encodeURIComponent(
"oauth_consumer_key=" + 
oauthConsumerKey + "&oauth_nonce=" + Date.now() + 
"&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + Date.now() + "&oauth_token=" + oauthAccessToken
);
var oauthBaseString = method + "&" + twitterurl + "&" + oauthParams;
var oauthSignatureKey = oauthConsumerSecret + "&" + oauthAccessTokenSecret;

var hmac = crypto.createHmac('sha1',oauthSignatureKey);

try {
	hmac.update(oauthBaseString);
	var oauthSignature = hmac.digest('base64');
}catch(err){
	browsermessage = browsermessage +" hmac problem "+err ;
}

const httpOptions = {
	path: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=shinygreyltd&count=2',
	method: 'GET',
	host: 'api.twitter.com',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length':'76',
		'Authorization': 'OAuth oauth_consumer_key="'+oauthConsumerKey+'", oauth_nonce="'+ Date.now() +'", oauth_signature="'+oauthSignature+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="'+Date.now()+'", oauth_token="'+oauthAccessToken+'", oauth_version="1.0"'
	}
};

(function getRequest(){
	if(envProtocol == "https"){var protocol = https;}else{var protocol = http;}
	protocol.get(envRequestUrl, (res) => {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];

		let error;
		if (statusCode !== 200){
			error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
		}else if(!/^application\/json/.test(contentType)){
			error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
		}
		if (error) {
			browsermessage = browsermessage + "\n 1 \n" +error.message+ "\n";
		// consume response data to free up memory
		res.resume();
		return;
		}
		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
		try {
			const parsedData = JSON.parse(rawData);
			browsermessage = browsermessage + "\n 2 \n" +rawData+ "\n";
		} catch (e) {
			browsermessage = browsermessage + "\n 3 \n" +e.message+ "\n";
		}
		});
	})
})()

var atweet = new Twitter();

var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end(
		"Hello Greg!  "+envGreg+" ... \n"
		+ browsermessage +  "\n"
	);
});
	
var port = process.env.PORT || 1337;
server.listen(port);
