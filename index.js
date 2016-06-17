var keyword = 'trump';
var resp;

function dispData(data){
	var lis = document.getElementById("dlist");
	lis.innerHTML = "";
	for(var i in data){
		console.log(data[i])
		var node = document.createElement("LI");            
		var textnode = document.createTextNode(Object.keys(data[i])[0]);    
		node.appendChild(textnode);                         
		lis.appendChild(node);
	}
}

function getData(){
		console.log("sent req");

		$.ajax({
			url: "http://localhost:8080/?kw=" + keyword,
			success: function(data){
				resp = JSON.parse(data);
				console.log(resp);
				dispData(resp);
				//console.log(typeof JSON.parse(data));
			},
			error: function(jq,stat,err){
				console.log(err);
			}
		});

	}


$(document).ready(function(){

	var ref = setInterval(getData,500);//start pulling data every 5 secs

	 
});