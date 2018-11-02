var http = require('http');

var server = http.createServer(function(request, response) {    
    var greg = process.env.GREG_VAR;
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello Greg!  "+greg+" ... The type of the var is "+typeof greg);

});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
