const ipc = require('electron').ipcMain

const Twitter = require('twitter');
const client = new Twitter({
	consumer_key: 'N3wqJX6CkJqDDnhjDwQavpSyT',
	consumer_secret: 'idmQdGuRMeDRRaeS0UwDUizKldySA30jbg9jbNLFp6g1tC3dEB',
	access_token_key: '199700251-fj0i5yeNc7oKzyqDkctr6pjyCx5Zg0YNwbjjm9Iy',
	access_token_secret: 'snmYGcgth0KA0UGxCzuGH6AJ2kEgkOjvTOyVyewxmgH1N'
});

ipc.on('request-twitter-trend', function(event, args) {
	// Seoul: 1132599
	client.get('trends/place', {id:23424977}, function(error, tweets, response) {
		if(!error) {
			//console.log(tweets)

			//var objects = JSON.parse(tweets);
			//objects = objects[0]['trends']

			event.sender.send('get-twitter-trend', tweets)
		} else {
			console.log(error)
			event.sender.send('get-twitter-trned', error)
		}
	})
})
