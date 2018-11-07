const http = require("http");
const fs = require("fs");
const path = require("path");

const {RestRequest} = require("../app/restrequest.js");

RestRequest.getRequest();

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
		<p>Data:</p>
		<p>${RestRequest.responseData}</p>
		</body>
		</html>
		`
		response.write(htmlrequestpage);
		response.end();
	}).listen(8000);
	console.log("Listening! (port 8000)");
});
