const http = require("http");
const fs = require("fs");
const path = require("path");

const {RestRequest} = require("../app/restrequest.js");
const {RestOauth} = require("../app/restrequest.js");

RestRequest.getRequest();
RestOauth.getRequest();

http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.end((`
		<html>
		<body>
			<h1>Hello!</h1>
			<p>Object based request:</p>
			<p>northwind</p>
			<p>${RestRequest.responseData}</p>
			<p>${RestRequest.rawrestData}</p>
			<p>twitter</p>
			<p>${RestOauth.responseData}</p>
			<p>${RestOauth.rawrestData}</p>

		</body>
		</html>
	`).replace(/^\t\t/gm, ''));
}).listen(process.env.PORT);
