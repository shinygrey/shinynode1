var http = require('http');
var https = require('https');
var browsermessage = " "
var crypto = require('crypto');

try {
	var urlUserTimeline = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
	var twitterurl = encodeURIComponent(this.urlUserTimeline);
	var method = "GET";
	var oauthConsumerKey = process.env.TWITTER_CONSUMER_KEY;
	var oauthAccessToken = process.env.TWITTER__ACCESS_TOKEN;
	var oauthParams = encodeURIComponent(
		"oauth_consumer_key=" + 
		oauthConsumerKey + "&oauth_nonce=" + Date.now() + 
		"&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + Date.now() + "&oauth_token=" + oauthAccessToken
	);
	var oauthBaseString = method + "&" + twitterurl + "&" + oauthParams;
	var oauthSignatureKey = process.env.TWITTER_CONSUMER_SECRET + "&" + process.env.TWITTER__ACCESS_TOKEN_SECRET;

	var hmac = crypto.createHmac('sha1',oauthSignatureKey);
	hmac.update(oauthBaseString);
	var oauthSignature = hmac.digest('base64');
}catch(err){
	browsermessage = browsermessage +"\nproblem "+err ;
}

var httpOptions = {
	path: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=shinygreyltd&count=2',
	method: 'GET',
	host: 'api.twitter.com',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length':'76',
		'Authorization': 'OAuth oauth_consumer_key="'+process.env.TWITTER_CONSUMER_KEY+'", oauth_nonce="'+ Date.now() +'", oauth_signature="'+oauthSignature+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="'+Date.now()+'", oauth_token="'+process.env.TWITTER__ACCESS_TOKEN+'", oauth_version="1.0"'
	}
};

function getJsonRequest(){
	var requestmessage = "\nstart ";
	
	try {
	
	https.get('https://reqres.in/api/users/2', (res) => {
		var statusCode = res.statusCode;
		var contentType = res.headers['content-type'];
		var error;
		if (statusCode !== 200){
			error = new Error('\nRequest Failed.\n' + statusCode);
		}else if(!/^application\/json/.test(contentType)){
			error = new Error('\nInvalid content-type.\n' + 'Expected application/json but received '+contentType);
		}
		if (error) {
			requestmessage = requestmessage + "\n1 " + error.message;
			res.resume();
			return;
		}
		res.setEncoding('utf8');
		var rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		
	
		
		res.on('end', () => {
			try {
				var parsedData = JSON.parse(rawData);
				requestmessage = requestmessage + "\n2 " + rawData;
			} catch (e) {
				requestmessage = requestmessage + "\n3 " + e.message;
			}
		});
	})
	
	}catch (e) {requestmessage = requestmessage + "\n4 " + e.message}
	
	return requestmessage;
}

try{
	browsermessage = browsermessage + getJsonRequest();
}catch(err){browsermessage = "\n " + browsermessage + err;}


var server = http.createServer(function(request, response) {
	var greg = process.env.GREG_VAR;
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end(
		"Hello Greg!  "+greg+" ... \n"
		+ browsermessage +  "\n"
	);
});
	
var port = process.env.PORT || 1337;
server.listen(port);
