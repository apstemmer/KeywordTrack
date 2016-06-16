var keyword = 'gun';
var rep;

$(document).ready(function(){

	function getData(){
		console.log("sent req");

		$.ajax({
			url: "http://localhost:8080/?kw=" + keyword,
			success: function(data){
				console.log("got resp" + data);
			},
			error: function(jq,stat,err){
				console.log(err);
			}
		});

		//rep = setTimeout(getData(),5000);
	}

	getData(); 
});