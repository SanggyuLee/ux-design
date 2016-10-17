const ipc = require('electron').ipcRenderer

ipc.send('request-twitter-trend', '')
ipc.on('get-twitter-trend', function(event, path) {
	var object = path[0].trends
	var output = '';
	for(var i = 0; i < object.length; i++) {
		if(i == 10)
			break;

		output += `<div>${object[i].name}<br></div>`
	}
	document.querySelector(".twitter-result").innerHTML = output
})
