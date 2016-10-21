const ipc = require('electron').ipcRenderer

ipc.send('request-twitter-trend', '')
ipc.on('get-twitter-trend', function(event, path) {
	var object = path[0].trends
	var output = '';
	for(var i = 0; i < object.length; i++) {
		if(i == 10)
			break;

		output += `<button type="button" id="${object[i].name}">${object[i].name}</button>`
	}

	var timer = 0
	var opacity = 0

	function slow_motion() {
		opacity += 0.04
		document.querySelector(".twitter-result-box").style.opacity = opacity
	
		if(opacity >= 1)
			clearInterval(timer)
	}

	timer = setInterval(slow_motion, 50)

	document.querySelector(".twitter-result-box").style.opacity = opacity
	document.querySelector(".twitter-result-box").style.display = "flex"
	document.querySelector(".twitter-result-box").innerHTML = output
})
