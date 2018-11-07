const http = require("http");
const fs = require("fs");
const path = require("path");

/*
const {RestRequest} = require("../app/restrequest.js");

RestRequest.getRequest()
<p>${RestRequest.responseData}</p>

*/

http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write((`
		<html>
		<body>
			<h1>Hello!</h1>
			<p>Object based request:</p>
			
		</body>
		</html>
	`).replace(/^\t\t/gm, ''));
	response.end();
}).listen(1337);
