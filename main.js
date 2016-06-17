/*
fill in a keyword and returns the public opinion associated with keyword
through Twitter # (potentially news article summary)
compares tweet with database of words with associated commonness... in real time



*/
var http = require("http");
var https = require("https");
var url = require("url"); 
var Twitter = require("twitter");
var fs = require('fs');
var express = require('express');
var querystring = require('querystring');
var keyword = '';
var ranked = {};
var kwlist = {};

var app = express();
app.use(express.static('/'));

var creds = {
  consumer_key: '9Y697ueM38FNk2t4DaRkC54aJ',
  consumer_secret: 'DDKpdupp8YAl0wBDLVyKIzQdJFiXUNBL1oYLaOodudS2izNPXY',
  access_token_key: '269968418-9Z2F6mGdbY3mBXhvZq7rm3ylXKvooJILRc7TmSEL',
  access_token_secret: 'QLwycUQu1K2GCmKAYnl5MR2e1QgsJPLowOfq2MyR0qOEd'
};

var client = new Twitter(creds);
client.options.keywords = [];

function dispData(li, topnum){
	//console.log(li);
	//console.log("called");
	var tops = [{'':0}];
	for(var key in li){
		//console.log(key + li[key]);
		if(li.hasOwnProperty(key)){
			//console.log('nahere');
			var amount = li[key];
			//console.log(tops[tops.length-1][Object.keys(tops[tops.length - 1])[0]]);
			if (tops[tops.length-1][Object.keys(tops[tops.length - 1])[0]] < amount){
				//console.log('madeit');
				for(var i = 0; i <= tops.length-1; i++)
				{
					
					if(tops[i][Object.keys(tops[i])[0]] < amount){
						//console.log(i);
						var obj = {};
						obj[key] = amount;
						//console.log(tops.length);
						//console.log("n: " + topnum);
						if(tops.length < topnum)
						{
							//console.log("added b4 max")
							tops.splice(i,0,obj);

						}else if(tops.length >= topnum){
							tops.splice(i,0,obj);
							tops.pop();
							//console.log("added after max");
						}
						//console.log(tops);
						break;
					}
				}
			}
		}
	}
	
	console.log(tops);
	return tops;
}


var Server = http.createServer(function(req,res){
	var pathname = url.parse(req.url).pathname;
	var query = url.parse(req.url).query;
	var qobj = querystring.parse(query);
	

	if(Object.keys(qobj).length === 1 && qobj.hasOwnProperty('kw')){
		var cnt = 0;
		keyword = qobj['kw'];
		console.log('kw: ' + keyword);

		
		//if keyword is not being watched, create new stream
		console.log(client.options.keywords);
		if(keyword !== '' && client.options.keywords.indexOf(keyword) === -1){

			var stream = client.stream('statuses/filter', {track: keyword});
			client.options.keywords.push(keyword);
			console.log("str: ");//client obj: VERSION, options, request


			stream.on('data', function(tweet) {
			  		//console.log(tweet.lang + '\n');
			  		//console.log(tweet.text.split(" "));
			  		var wordList = tweet.text.toLowerCase().split(" ");
			  		var patt = /\/|@/;//to filter words in tweet
			  		
			  		for(var i in wordList){
			  			var word = wordList[i];
			  			if(!patt.test(word)){
				  			if(word in ranked){
				  				ranked[word] += 1;
				  			}else{
				  				ranked[word] = 1;
				  			}
				  		}
			  		}
			  		//console.log(ranked);
			});

			stream.on('error', function(error) {
			  console.log('e1: ' + error.source+ "|"+Object.keys(error));
			});
		}


		//setInterval(function(){dispData(ranked,1000);},10000);

		
		 

		res.writeHead(200, {'content-type':'text/html'});
		res.write(JSON.stringify(dispData(ranked,10)));
		res.end();

	}

	if(pathname.substr(1) == 'index.html' || pathname.substr(1) == 'index.js')
	{
		fs.readFile(pathname.substr(1), (err, data) => {
			if (err){
				console.log('error:' + err);
				res.writeHead(404, {'content-type':'text/html'});
			}
			else{
				//console.log(data.toString());
				res.writeHead(200, {'content-type':'text/html'});
				res.end(data.toString());
			}
		});
	}

	req.on('data',function(chunk){
		console.log("received!");
	});
	//res.end("Thanks for requesting!");
});


//console.log(Server);

Server.listen(8080, function(){
	console.log("Server listening on " + this.address().port);
});


/*
created_at
id
id_str
text
source
truncated
in_reply_to_status_id
in_reply_to_status_id_str
in_reply_to_user_id
in_reply_to_user_id_str
in_reply_to_screen_name
user
geo
coordinates
place
contributors
retweeted_status
is_quote_status
retweet_count
favorite_count
entities
extended_entities
favorited
retweeted
possibly_sensitive
filter_level
lang
timestamp_ms*/
 