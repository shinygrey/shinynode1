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
	response.end((`
		<html>
		<body>
			<h1>Hello!</h1>
			<p>Object based request:</p>
			
		</body>
		</html>
	`).replace(/^\t\t/gm, ''));
}).listen(process.env.PORT);


/*
var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end(
		"Hello Greg!  "+envGreg+" ... \n"
		+ browsermessage +  "\n"
		+ atweet.test +  "\n"
	);
});
	
var port = process.env.PORT || 1337;
server.listen(port);
*/
