const ipc = require('electron').ipcRenderer

document.body.addEventListener('click', function(event) {
	if(event.target.type == 'button') {
		ipc.send('request-NYTimes-articles', event.target.id)
	}
})
