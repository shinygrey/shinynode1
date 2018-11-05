const crypto = require('crypto');
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

exports.RestRequest = "import worked";
