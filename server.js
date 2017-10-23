var http = require('http');
var express= require('express');
var app = express();

// app.get('/',function(request, response) {
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.end("Hello World!");
// });
// var server = http.createServer(function(request, response) {
    
    //     response.writeHead(200, {"Content-Type": "text/plain"});
    //     response.end("Hello World!");
    
    // });
app.use(express.static(__dirname+ "/" ));

var port = process.env.PORT || 1337;
 app.listen(port);

console.log("Server running at http://localhost:%d", port);