const http = require("http");
const fs = require("fs");
const path = require("path");

const {RestRequest} = require("../app/restrequest.js");
const {RestOauth} = require("../app/restrequest.js");

RestRequest.getRequest();

http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.end((`
		<html>
		<body>
			<h1>Hello!</h1>
			<p>Object based request:</p>
			<p>${RestRequest.responseData}</p>
			<p>${RestOauth.responseData}</p>

		</body>
		</html>
	`).replace(/^\t\t/gm, ''));
}).listen(process.env.PORT);
