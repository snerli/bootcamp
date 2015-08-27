define(['jquery'], function() {

  function successFn(xhr) {
  		return function() {

			console.log(xhr.readyState, xhr.status);
  		if(xhr.readyState === 4 && xhr.status === 200) {
  			console.log(xhr.responseText);
  		}};
  };

  function myAjax(url) {
  	var xhr = new XMLHttpRequest();
  	xhr.onreadystatechange = successFn(xhr);
  	xhr.open("GET", url);
  	xhr.send();
  };

  myAjax("/api/widgets");

});

/*

define(['jquery'], function() {

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {

		console.log(xhr.readyState, xhr.status);

		if(xhr.readyState === 4 && xhr.status === 200) {
			console.log(xhr.responseText);
		}
	};

	xhr.open("GET", "/api/widgets");
	xhr.send();

	$.ajax("/api/widgets").success(function() {
		console.log(arguments);

	//request("/api/widgets").then(function() {
	//		console.log(arguments);
	//	});

	});
});

*/
