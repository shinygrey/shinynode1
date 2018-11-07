const http = require("http");
const fs = require("fs");
const path = require("path");

const {RestRequest} = require("../app/restrequest.js");

RestRequest.getRequest();

http.createServer(function(request, response){
	response.write(Header(200, {"Content-Type": "text/html"}));
	console.log(request.url);
	response.end((`
		<html>
		<body>
			<h1>Hello!</h1>
			<p>Object based request:</p>
			<p>${RestRequest.responseData}</p>
		</body>
		</html>
	`).replace(/^\t\t/gm, ''));
}).listen(8000);
console.log("Listening! (port 8000)");
