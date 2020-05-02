When I first tried Node.js I was experimenting with making requests to the Twitter API.  I read the instructions at [developer.twitter.com](https://developer.twitter.com/).  

I learnt to use crypto.createHmac() and how to properly store secrets in Heroku config vars.  
I remember spending an unfortunate amount of time not understanding why my requests weren't being authorised .... I was certained I'd gotten the OAuth steps correct.  
... then I realised Date.Now() returns milliseconds and I needed to convert to seconds for the timestamp.
