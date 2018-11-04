var http = require('http');
var https = require('https');
var browsermessage = " "
const crypto = require('crypto');

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

var restGetRequest = (function () {
    function restGetRequest() {
        var _this = this;
        var statusCode = res.statusCode;
        var contentType = res.headers['content-type'];
        var error;
        if (envProtocol == "https") {
            var protocol = https;
        }
        else {
            var protocol = http;
        }
        protocol.get(envRequestUrl, function (res) {
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + ("Status Code: " + statusCode));
            }
            else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' + ("Expected application/json but received " + contentType));
            }
            if (error) {
                _this.responseString += "\n 1 \n" + error.message + "\n";
                res.resume();
                return;
            }
            res.setEncoding('utf8');
            res.on('data', function (chunk) { _this.rawData += chunk; });
            res.on('end', function () {
                try {
                    _this.parsedData = JSON.parse(_this.rawData);
                    _this.responseString += "\n 2 \n" + _this.rawData + "\n";
                }
                catch (e) {
                    _this.responseString += "\n 3 \n" + e.message + "\n";
                }
            });
        });
    }
    return restGetRequest;
}());

var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	
	var request = new restGetRequest;
	
	response.end(
		"Hello Greg!  "+envGreg+" ... \n"
		+ request.rawData +  "\n"
	);
});
	
var port = process.env.PORT || 1337;
server.listen(port);
