const express = require('express')
const path = require('path');

const {twitterRequest} = require("./request-twitter");

const app = express()
const port = process.env.PORT || 3000

app.use('/assets',express.static('assets'));
app.get('/', (req, res) => res.sendFile(
	path.resolve(__dirname, './assets/index.html')
))

app.get('/twitter', (req, res) => {
	twitterRequest.sendRequest()
	res.json(twitterRequest.responseData)
	res.end()
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
