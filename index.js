var http = require('http');
var browsermessage = " "
const crypto = require('crypto');

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

}catch(err){
	browsermessage = browsermessage +" wha? "+err ;
}

try {
	hmac.update(oauthBaseString);
}catch(err){
	browsermessage = browsermessage +" hmac.update problem "+err ;
}

try {
	var oauthSignature = hmac.digest('base64');
}catch(err){
	browsermessage = browsermessage +" hmac.digest problem "+err ;
}



const httpOptions = {
	path: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=shinygreyltd&count=2',
	method: 'GET',
	host: 'api.twitter.com',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length':'76',
		'Authorization': 'OAuth oauth_consumer_key="'+process.env.TWITTER_CONSUMER_KEY+'", oauth_nonce="'+ Date.now() +'", oauth_signature="'+oauthSignature+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="'+Date.now()+'", oauth_token="'+process.env.TWITTER__ACCESS_TOKEN+'", oauth_version="1.0"'
	}
};

/*

  res.on('end', () => {
    console.log('No more data in response.');
  });
});
request.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
// write data to request body
request.write(postData);
request.end();
*/


browsermessage =  browsermessage + " it's fine ";

var server = http.createServer(function(request, response) {
var greg = process.env.GREG_VAR;
response.writeHead(200, {"Content-Type": "text/plain"});
response.end(
"Hello Greg!  "+greg+" ... The type of the var is "+typeof greg+"\n"
+ browsermessage +  "\n"
);
});
	
var port = process.env.PORT || 1337;
server.listen(port);
