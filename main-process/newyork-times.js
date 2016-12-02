const ipc = require('electron').ipcMain
const request = require('request')

ipc.on('request-NYTimes-articles', function(event, args) {
	console.log("request-NYTimes-articles");
	request.get({
		url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
		qs: {
			'api-key': "43e872d5182140db993b4bda1eee9fb2",
			'q': args
		},
	}, function(err, response, body) {
		body = JSON.parse(body);
		event.sender.send('get-NYTimes-articles', body)
	})
})
