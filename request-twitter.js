const url = require('url');
const http = require("http");
const https = require("https");
const crypto = require("crypto");

exports.twitterRequest = {
	responseData: "",
	contentType: "",
	statusCode: 0,
	oauthNonce: '',
	timeStamp: 0,
	count: 4,
	screenName: 'shinygreyltd',
	serverResponse: '',
	requestUrl: "https://api.twitter.com/1.1/statuses/user_timeline.json",
	options: {
		method: 'GET',
		host: 'api.twitter.com',
		path: '/1.1/statuses/user_timeline.json?screen_name=shinygreyltd&count='+this.count,
		headers: {
			'Authorization': "auth not set"
		}
	},
	oauthConsumerKey: encodeURIComponent(process.env.TWITTER_CONSUMER_KEY),
	oauthAccessToken: encodeURIComponent(process.env.TWITTER_ACCESS_TOKEN),
	oauthConsumerSecret: encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET),
	oauthAccessTokenSecret: encodeURIComponent(process.env.TWITTER_ACCESS_TOKEN_SECRET),

	getProtocol: function (requestUrl){
		var protocolToUse;
		if((url.parse(requestUrl)).protocol == "https:"){
			protocolToUse = https;
		}else{
			protocolToUse = http;
		}
		return protocolToUse;
	},

	sendRequest: function(){
		var protocol = this.getProtocol(this.requestUrl);
		this.getAuth();
		protocol.get(this.options, (res) => {
			this.contentType = res.headers['content-type'];
			this.statusCode = res.statusCode;
			
			for (var key in res.headers) {
				if (Object.prototype.hasOwnProperty.call(res.headers, key)){
					var val = res.headers[key];
					this.serverResponse += `<p>${key} - ${val}</p>`;
				}
			}
			if (this.statusCode !== 200){
				res.setEncoding('utf8');
				res.on('data', (chunk) => { this.responseData += chunk;});
				var error = handleRequestError(this.statusCode);
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

			function handleRequestError(errorStatusCode){
				var error = new Error(`Request Failed. Status Code: ${errorStatusCode}`);
			return error;
			};
		})
	},

	checkContentType: function(contentType){
		if(/^application\/xml/.test(contentType)){
			console.log("xml")
		}else if(/^application\/json/.test(contentType)){
			console.log("json")
		}else{
			var error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
			return error;
		}
	},

	getAuth: function(){
		this.timeStamp = Math.floor(Date.now() / 1000);
		this.oauthNonce = this.randomString(32);
		var result = `OAuth oauth_consumer_key="${this.oauthConsumerKey}", oauth_nonce="${this.oauthNonce}", oauth_signature_method="HMAC-SHA1", oauth_token="${this.oauthAccessToken}", oauth_timestamp="${this.timeStamp}", oauth_version="1.0", oauth_signature="${this.createSignature()}"`;
		this.options.headers.Authorization = result;
	},

	createSignature: function(){
		var oauthSignatureKey = this.oauthConsumerSecret+"&"+this.oauthAccessTokenSecret;
		var hmac = crypto.createHmac('sha1',oauthSignatureKey);
		try {
			hmac.update(this.oauthBaseString());
			var oauthSignature = hmac.digest('base64');
		}catch(err){
			console.log(" hmac problem "+err);
		}
		return encodeURIComponent(oauthSignature);
	},

	randomString: function(length){
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	},

	oauthBaseString: function(){
		var baseString = `GET&${encodeURIComponent(this.requestUrl)}&count%3D${this.count}%26oauth_consumer_key%3D${this.oauthConsumerKey}%26oauth_nonce%3D${this.oauthNonce}%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D${this.timeStamp}%26oauth_token%3D${this.oauthAccessToken}%26oauth_version%3D1.0%26screen_name%3D${this.screenName}`
		return baseString;
	}

};
