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

try {

	http.get('https://reqres.in/api/users/2', (res) => {
	  const { statusCode } = res;
	  const contentType = res.headers['content-type'];

	  let error;
	  if (statusCode !== 200) {
		error = new Error('Request Failed.\n' +
						  `Status Code: ${statusCode}`);
	  } else if (!/^application\/json/.test(contentType)) {
		error = new Error('Invalid content-type.\n' +
						  `Expected application/json but received ${contentType}`);
	  }	  
	  if (error) {
		try {
		browsermessage = if(typof error != string){browsermessage + "it's not a string "+typof error}else{browsermessage + error};
		}catch(err){browsermessage =  browsermessage + "\ndoesn't work that way";}
				
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
		  browsermessage =  browsermessage +"\n\n"+parsedData;
		} catch (e) {
		  try {console.error(e.message)}catch(){};
		}
	  });
	}).on('error', (e) => {
	  console.error(`Got error: ${e.message}`);
	});

}catch(err){{browsermessage =  browsermessage + "\n no good: "+err;}





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
