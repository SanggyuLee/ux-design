const ipc = require('electron').ipcRenderer

ipc.on('get-NYTimes-articles', function(event, args) {
	var timer = 0
	var opacity = 0

	function slow_motion() {
		opacity += 0.04
		document.querySelector(".articles").style.opacity = opacity
	
		if(opacity >= 1)
			clearInterval(timer)
	}

	console.log(args.response.docs)

	var articles = args.response.docs
	var output = '';
	for(var i = 0; i < articles.length; i++) {
		output += `<div>${articles[i].snippet}</div>`
		output += `<br>`
	}

	timer = setInterval(slow_motion, 50)

	document.querySelector(".articles").style.opacity = opacity
	document.querySelector(".articles").style.display = "flex"
	document.querySelector(".articles").innerHTML = output
})
