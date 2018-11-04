var http = require('http');
var https = require('https');
const crypto = require('crypto');

const express= require('express'),
path = require('path');
const app =express();

const envProtocol = process.env.REQUEST_PROTOCOL;
const envRequestUrl = process.env.REQUEST_URL;
var browsermessage = " "

(function getRequest(){
	if(envProtocol == "https"){var protocol = https;}else{var protocol = http;}
	protocol.get(envRequestUrl, (res) => {
		const { statusCode } = res;
		const contentType = res.headers['content-type'];

		let error;
		if (statusCode !== 200){
			error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
		}else if(!/^application\/json/.test(contentType)){
			error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
		}
		if (error) {
			browsermessage = browsermessage + "\n 1 \n" +error.message+ "\n";
		// consume response data to free up memory
		res.resume();
		return;
		}
		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				browsermessage = browsermessage + "\n 2 \n" +rawData+ "\n";
			} catch (e) {
				browsermessage = browsermessage + "\n 3 \n" +e.message+ "\n";
			}
		});
	})
})()

/* RESTORE FOR SHINYANGLE
app.use(express.static('./dist/shinyangle1'));*/

app.use('/backend',function(req, res, next){
	var theresponse = browsermessage;
	var allowedFromConfig = process.env.ALLOWED_SITES;
	var allowedOrigins = allowedFromConfig.split(",");
	
	if((req.get('Referer') == "https://shinyangle1.herokuapp.com/" && req.get('Origin') == undefined)){
		res.send("\n"+theresponse+"\n");
		next();
	}else if(allowedOrigins.includes(req.get('Origin'))){
		res.header("Access-Control-Allow-Origin", req.get('Origin'));
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.send("\n"+theresponse+"\n");
		next();
	}else{
		res.send('not accessible');
		res.status(403).end('forbidden');
	}
});

/* RESTORE FOR SHINYANGLE
app.get('/*', (req,res)=>{
	res.sendFile(path.join(__dirname,'/dist/shinyangle1/index.html'));
});
*/

app.get('/*', (req,res)=>{
	res.send('Look ma, no HTML!');
});
*/

app.listen(process.env.PORT || 8080, ()=>{
	console.log('Server started');
})
