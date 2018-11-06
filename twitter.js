const crypto = require('crypto');

exports.Twitter = (function (){
	
	const oauthConsumerKey = 'xvz1evFS4wEEPTGEFPHBog';//process.env.TWITTER_CONSUMER_KEY;
	const oauthAccessToken = '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb'; //process.env.TWITTER__ACCESS_TOKEN;
	const oauthNonce = randomString(32);
	var oauthSignature = "";
	
	function randomString(length){
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}
	
	function TweetAuth(){
		this.number = 0
		this.creation();
		this.timescreated = "object created "+(this.number)
	}
		
	TweetAuth.prototype.creation = function(){this.number++}
	
	
	TweetAuth.prototype.getSignature = function(){
		var Url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
		var messages = "";
		
		function oauthBaseString(){
			var parameters = encodeURIComponent(
				"oauth_consumer_key=" + oauthConsumerKey + "&oauth_nonce=" + oauthNonce + "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" + Date.now() + "&oauth_token=" + oauthAccessToken + "&oauth_version:1.0"
			);
			var baseString = "GET" + "&" + encodeURIComponent(Url) + "&" + parameters;
			/*FOR TESTING - REMOVE*/messages += "<p>BASESTRING:  " + baseString + "</p>"+"<p>"+oauthConsumerKey+"</p>"/*FOR TESTING - REMOVE*/
			return baseString;
		}
		
		function CreateSignature(){
			const oauthConsumerSecret = randomString(50); //process.env.TWITTER_CONSUMER_SECRET;
			const oauthAccessTokenSecret = randomString(45); //process.env.TWITTER__ACCESS_TOKEN_SECRET;
			var oauthSignatureKey = oauthConsumerSecret+"&"+oauthAccessTokenSecret;
			var hmac = crypto.createHmac('sha1',oauthSignatureKey);
			try {
				hmac.update(oauthBaseString(Url,oauthConsumerKey,oauthAccessToken));
				var oauthSignature = hmac.digest('base64');
			}catch(err){
				messages += " hmac problem "+err ;
			}
			return oauthSignature;
		}
		
		function scopeTest(){
			var thescopeTest = Url +"   test  ";
			return thescopeTest;
		}
		
		var result = encodeURIComponent(CreateSignature());
		return result;
	}
	
	TweetAuth.prototype.getHeader = function(){
		var result = `Accept: */*
		Connection: close
		User-Agent: OAuth gem v0.4.4
		Content-Type: application/x-www-form-urlencoded
		Authorization:OAuth oauth_consumer_key="${oauthConsumerKey}",oauth_nonce="${oauthNonce}",oauth_signature="${oauthSignature}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${Date.now()}",oauth_token="${oauthAccessToken}",oauth_version="1.0"
		Content-Length: 76
		Host: api.twitter.com`		
		return result
	}
	
	TweetAuth.prototype.getAuth = function(){
		var result = `OAuth oauth_consumer_key="${oauthConsumerKey}",oauth_nonce="${oauthNonce}",oauth_signature="${this.getSignature()}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${Date.now()}",oauth_token="${oauthAccessToken}",oauth_version="1.0"`

		return result
	}
	
	return TweetAuth;
}());
