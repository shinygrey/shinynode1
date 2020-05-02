# What is this
This repo was created when I was first learning Node.js.  When I first tried Node I was experimenting with making requests to the Twitter API.  

## Why?
I'm aware there are libraries that could have done all this for me but it was a learning exercise at the time.  
I read the instructions at [developer.twitter.com](https://developer.twitter.com/) and learnt to assemble an authorisation header which included use of `crypto.createHmac()`, as well as how to properly store secrets in Heroku config vars. 

### sooo .... 
I remember spending an unfortunate amount of time not understanding why my requests weren't being authorised .... I was certained I'd gotten the OAuth steps correct.
... then I realised `Date.Now()` returns milliseconds and I needed to convert to seconds for the timestamp.

## Go See
The result can be seen at [shinynode1.herokuapp.com](https://shinynode1.herokuapp.com/).
