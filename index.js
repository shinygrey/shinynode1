var ini = require("ini")
var youknowwhatyoudid = require("look-of-disapproval")
const http = require("http");
const fs = require("fs");
const path = require("path");

const {RestRequest} = require("../app/restrequest.js");
const {Twitter} = require("../app/twitter.js");

var envProtocol = "http";
//var envRequestUrl = "http://northwind.servicestack.net/query/customers.json?Ids=CHOPS,FRANK";

var oauthForTwitter = new Twitter();

//var northwind = new RestRequest("http://northwind.servicestack.net/query/customers.json?Ids=CHOPS");
/*var regres = new RestRequest("https://reqres.in/api/users");*/


function highOrderExample(){
	function repeat(n, action) {
	for (let i = 0; i < n; i++) {
		action(i);
	}
}
	repeat(2, function(i){
		labels.push(`Unit ${i + 1}`)
	});

	repeat(2, i => {
		labels.push(`Unit ${i + 1}`);
	});
}


const twitterOptions = {
	hostname: 'api.twitter.com',
	port: 80,
	path: '/1.1/statuses/user_timeline.json',
	method: 'GET',
	headers:{
		'Accept': '*/*',
		'Connection': 'close',
		'User-Agent': 'OAuth gem v0.4.4',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization':`${oauthForTwitter.getAuth()}`,
		'Content-Length': 76,
		'Host': 'api.twitter.com'
	}
};

var theTwitterResponse = ""; 

function twitterRest(){
	https.get('https://api.twitter.com/1.1/statuses/user_timeline.json', twitterOptions, (res) => {
	const { statusCode } = res;
	const contentType = res.headers['content-type'];
	if (statusCode !== 200){
		var error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
	}else if(!/^application\/json/.test(contentType)){
		var error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
	}
	if (statusCode !== 200){
		theTwitterResponse += "\nerrors here:\n" + error.message + "\n";
		res.resume();
		return;
	}
	res.setEncoding('utf8');
	res.on('data', (chunk) => { theTwitterResponse += chunk; });
})};


fs.readFile('C:/Users/Greg/Documents/githubrepos/node-test2/index.html', function (err, html) {
	if (err){
		throw err;
	}
	http.createServer(function(request, response){
		response.writeHeader(200, {"Content-Type": "text/html"});
		var baseurl = request.socket.localAddress;
		/*
		var nwdata = JSON.parse(northwind.rawdata);		
		<p>northwind: ${nwdata.Results[0].Id}</p>		
		<p>regres: ${regres.rawdata}</p>
		
		
		*/
	
	var htmlrequestpage = `
		<html>
		<body>
		<h1>Hello!</h1>
		<p>Twitter:</p>
		<p>${oauthForTwitter.getAuth()}</p>
		<p>${theTwitterResponse}</p>
		</body>
		</html>
		`
		response.write(htmlrequestpage);
		response.end();
	}).listen(8000);
	console.log("Listening! (port 8000)");
});
