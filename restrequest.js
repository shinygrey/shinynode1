const url = require('url');
const http = require("http");
const https = require("https");
const crypto = require("crypto");

var RestRequest = {
	responseData: "",
	protocol: {},
	contentType: "",
	statusCode: 0,
	requestUrl: "http://northwind.servicestack.net/query/customers.json",
	requestUrlWithArgs: this.requestUrl+"?Ids=FRANK,CHOPS",
	options: {
		method: 'GET',
		host: 'northwind.servicestack.net',
		path: '/query/customers.json?Ids=FRANK,CHOPS',
		headers: {'Content-Type': 'application/json'}
	},
	
	getProtocol: function () {
		if((url.parse(this.requestUrl)).protocol == "https:"){
			this.protocol = https;
		}else{
			this.protocol =  http;
		}
	},
	
	getRequest: function(){
		this.getProtocol(this.requestUrlWithArgs);
		this.protocol.get(this.options, (res) => {
		this.contentType = res.headers['content-type'];
		this.statusCode = res.statusCode;
		if (this.statusCode !== 200){
			var error = this.handleRequestError();
		}else{
			var error = this.checkContentType(this.contentType)
		};
		if(error){
			console.log("Error:\n"+error.message);
			res.resume();
			return;
		}
		res.setEncoding('utf8');
		res.on('data', (chunk) => { this.responseData += chunk;});
		function handleRequestError(){
			var error = new Error(`Request Failed. Status Code: ${this.statusCode}`);
		return error;
		};
	})},
	
	
	checkContentType: function(contentType){
		if(/^application\/xml/.test(contentType)){
			console.log("xml")
		}else if(/^application\/json/.test(contentType)){
			console.log("json")
		}else{
			var error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
			return error;
		}
	}
};

exports.RestRequest = RestRequest;

var RestOauth = Object.assign(Object.create(RestRequest),{
	oauthConsumerKey: process.env.TWITTER_CONSUMER_KEY,
	oauthAccessToken: 'process.env.TWITTER_ACCESS_TOKEN',
	oauthNonce: '',
	timeStamp:0,
	requestUrl: "https://api.twitter.com/1.1/statuses/user_timeline.json",
	requestUrlWithArgs: this.requestUrl,
	options: {
		method: 'GET',
		host: 'api.twitter.com',
		path: '/1.1/statuses/user_timeline.json',
		headers: {
			'User-Agent': 'OAuth gem v0.4.4',
			'Content-Type': 'application/json',
			'Authorization': getAuth(),
		}
	},
	randomString: function(length){
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	},
	
	oauthBaseString: function(requestUrl){
		this.oauthNonce = this.randomString(32);
		this.timeStamp = Date.now();
		
		var parameters = encodeURIComponent(
			"oauth_consumer_key=" + this.oauthConsumerKey + "&oauth_nonce=" + this.oauthNonce + "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + this.timeStamp + "&oauth_token=" + this.oauthAccessToken + "&oauth_version:1.0"
		);
		var baseString = "GET" + "&" + encodeURIComponent(requestUrl) + "&" + parameters;
		
		return baseString;
	},
	
	CreateSignature function(requestUrl){
		const oauthConsumerSecret = if(process.env.TWITTER_CONSUMER_SECRET != undefined){process.env.TWITTER_CONSUMER_SECRET;}else{this.randomString(50);}
		const oauthAccessTokenSecret = if(process.env.TWITTER_ACCESS_TOKEN_SECRET != undefined){process.env.TWITTER_ACCESS_TOKEN_SECRET;}else{this.randomString(45);}
		var oauthSignatureKey = oauthConsumerSecret+"&"+oauthAccessTokenSecret;
		var hmac = crypto.createHmac('sha1',oauthSignatureKey);
		try {
			hmac.update(this.oauthBaseString(requestUrl));
			var oauthSignature = hmac.digest('base64');
		}catch(err){
			messages += " hmac problem "+err ;
		}
		return oauthSignature;
	},
	
	getAuth: function(requestUrl){
		var result = `OAuth oauth_consumer_key="${this.oauthConsumerKey}",oauth_nonce="${this.oauthNonce}",oauth_signature="${this.CreateSignature(requestUrl)}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${this.timeStamp}",oauth_token="${this.oauthAccessToken}",oauth_version="1.0"`
		return result
	}
});

exports.RestOauth = RestOauth;
