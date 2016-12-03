const ipc = require('electron').ipcMain;
const Twitter = require('twitter');

const client = new Twitter({
	consumer_key: 'N3wqJX6CkJqDDnhjDwQavpSyT',
	consumer_secret: 'idmQdGuRMeDRRaeS0UwDUizKldySA30jbg9jbNLFp6g1tC3dEB',
	access_token_key: '199700251-fj0i5yeNc7oKzyqDkctr6pjyCx5Zg0YNwbjjm9Iy',
	access_token_secret: 'snmYGcgth0KA0UGxCzuGH6AJ2kEgkOjvTOyVyewxmgH1N'
});

ipc.on('request-twitter-country', function(event, args) {
	console.log(args);

	client.get('trends/available', {id:23424977}, function(error, tweets, response) {
		if(!error) {
			event.sender.send('get-twitter-country', tweets);
		} else {
			console.log(error);
			event.sender.send('get-twitter-country', error);
		}
	});
});

ipc.on('request-twitter-trend', function(event, args, region) {
	console.log('request trend: ' + args);
	client.get('trends/place', {id:args, exclude: 'hashtags'}, function(error, tweets, response) {
		if(!error) {
			event.sender.send('get-twitter-trend', tweets, region);
		} else {
			console.log(error);
			event.sender.send('get-twitter-trend', error, region);
		}
	});
});

ipc.on('request-twitter-search', function(event, args) {
	console.log('request search: ' + args);
	client.get('search/tweets', {q:args}, function(error, tweets, response) {
		if(!error) {
			event.sender.send('get-twitter-search', tweets);
		} else {
			console.log(error);
			event.sender.send('get-twitter-search', error);
		}
	});
});
