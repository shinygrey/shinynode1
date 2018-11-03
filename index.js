var http = require('http');

var server = http.createServer(function(request, response) {
	var greg = process.env.GREG_VAR;
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end(
	"Hello Greg!  "+greg+" ... The type of the var is "+typeof greg+"\n"
	+ process.env.TWITTER_CONSUMER_KEY
    );

});

var port = process.env.PORT || 1337;
server.listen(port);



/*

var Oauth = {
	urlUserTimeline:'https://api.twitter.com/1.1/statuses/user_timeline.json',
	url:encodeURIComponent(this.urlUserTimeline),
	method:"GET",
	oauthConsumerKey:process.env.TWITTER_CONSUMER_KEY,
	oauthAccessToken:process.env.TWITTER__ACCESS_TOKEN,
	oauthParams: function(){
		return encodeURIComponent("oauth_consumer_key=" + this.oauthConsumerKey + "&oauth_nonce=" + Date.now() + "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + Date.now() + "&oauth_token=" + this.oauthAccessToken);
	},
	oauthBaseString: function(){
		return this.method + "&" + this.url + "&" + this.oauthParams;
	},
	oauthSignatureKey : function(){return process.env.TWITTER_CONSUMER_SECRET + "&" + process.env.TWITTER__ACCESS_TOKEN_SECRET;}
};

crypto.createHmac('sha1',Oauth.oauthSignatureKey);
hmac.update(Oauth.oauthBaseString);
var oauthSignature = hmac.digest('base64');
*/

/*

const httpOptions = {
	path: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=shinygreyltd&count=2'
	method: 'GET'
	host: 'api.twitter.com'
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length':'76',
		'Authorization': 'OAuth oauth_consumer_key="'+process.env.TWITTER_CONSUMER_KEY+'", oauth_nonce="'+ Date.now() +'", oauth_signature="'+oauthSignature+'", oauth_signature_method="HMAC-SHA1", oauth_timestamp="'+Date.now()+'", oauth_token="'+process.env.TWITTER__ACCESS_TOKEN+'", oauth_version="1.0"'
	}
};

const request = http.request(httpOptions, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

request.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
request.write(postData);
request.end();*/
