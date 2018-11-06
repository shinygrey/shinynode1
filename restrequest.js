const url = require('url');
const http = require("http");
const https = require("https");

exports.RestRequest = (function () {
	function aRequest(requestUrl){
		this.rawdata = "";
		this.protocol = this.getProtocol(requestUrl);
		this.getRequest(requestUrl,this.protocol);
	}
	
	aRequest.prototype.getProtocol = function (requestUrl) {
		if((url.parse(requestUrl)).protocol == "https:"){
			return https;
		}else{
			return http;
		}
	}	

	aRequest.prototype.getRequest = function (requestUrl,protocol){
		protocol.get(requestUrl, (res) => {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];

		if (statusCode !== 200){
			var error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
		}else if(!/^application\/json/.test(contentType)){
			var error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
		}
		if (statusCode !== 200){
			console.log(error.message+ "\n");
			res.resume();
			return;
		}
		res.setEncoding('utf8');
		res.on('data', (chunk) => { this.rawdata += chunk; });
	})};
	
	return aRequest;
}());
