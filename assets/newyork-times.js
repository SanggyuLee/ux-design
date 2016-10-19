const ipc = require('electron').ipcRenderer

ipc.on('get-NYTimes-articles', function(event, args) {
	console.log(args.response.docs)

	var articles = args.response.docs
	var output = '';
	for(var i = 0; i < articles.length; i++) {
		output += `<div>${articles[i].snippet}</div>`
		output += `<br>`
	}

	document.querySelector(".articles").innerHTML = output
})
