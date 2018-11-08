const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const {RestRequest, RestOauth, TwitterRequest} = require("./restrequest");

RestOauth.sendRequest();
TwitterRequest.sendRequest();
RestRequest.sendRequest();

http.createServer(function(request, response){
	response.writeHeader(200, {"Content-Type": "text/html"});
	/*<p>${request.socket.localAddress}</p>*/
	response.end((`
		<html>
		<body>			
			<h1>Requests</h1>
			<p>${RestOauth.responseData}</p>
			<p></p>
			<p>Twitter Request:</p>
			<p>${TwitterRequest.responseData}</p>			
			<p></p>
			<p>${RestRequest.responseData}</p>
		</body>
		</html>
	`).replace(/^\t\t/gm, ''));
}).listen(process.env.PORT);
