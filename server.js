const express = require('express')
const path = require('path')

const {twitterRequest} = require("./request-twitter")

const app = express()
const port = process.env.PORT || 3000

twitterRequest.sendRequest()

app.use('/assets',express.static('assets'));
app.get('/', (req, res) => res.sendFile(
	path.resolve(__dirname, './assets/index.html')
))

app.get('/twitter', (req, res) => {
	res.json(JSON.parse(twitterRequest.responseData))
	res.end()
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
