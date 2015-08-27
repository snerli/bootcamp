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

/*
when promise resolves, call the then function immediately

e.preventdefault - do not do default behaviour
e.stoppropogation - click on button propogates to div then that to document and this function stops it
e.stopimmediatepropogation - stops any additional events in  stack

*/
