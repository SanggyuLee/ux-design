const ipc = require('electron').ipcRenderer;
const wordcloud = require('WordCloud');
let onRegionClick = null;

console.log(wordcloud);
console.log(wordcloud.isSupported);

ipc.send('request-twitter-country', '');

ipc.on('get-twitter-country', function(event, tweets) { 
	onRegionClick = (element, code, region) => {
		let isExist = false;
		console.log("hahaha");
		for(let i = 0; i < tweets.length; i++) {
			if(tweets[i].name === region) {
				isExist = true;
				document.body.style.display = "relative";
				document.getElementById("vmap").style.display = "none";

				let worldmap = document.createElement("img");
				worldmap.src = "./assets/img/worldmap.png";
				worldmap.style.cursor = "pointer";
				worldmap.style.position = "absolute";
				worldmap.style.top = "30px";
				worldmap.style.left = "30px";
				worldmap.id = "worldmap";
				worldmap.onclick = (event) => {
					location.reload();
				};

				let label = document.getElementById("label");
				label.innerHTML = region;

				document.body.appendChild(worldmap);

				document.getElementById("twitter").style.display = "inherit";
				ipc.send('request-twitter-trend', tweets[i].woeid, region);

				break;
			}
		}

		console.log(isExist);
	};

	jQuery(document).ready(function () {
		jQuery('#vmap').vectorMap({
			map: 'world_en',
			backgroundColor: '#333333',
			color: '#ffffff',
			hoverOpacity: 0.7,
			selectedColor: '#666666',
			enableZoom: true,
			showTooltip: true,
			scaleColors: ['#C8EEFF', '#006491'],
			values: sample_data,
			normalizeFunction: 'polynomial',
			onRegionClick: onRegionClick
		});
	});
});

ipc.on('get-twitter-trend', (event, path, region) => {
	console.log(path);
	let list = [];
	let tweets = path[0].trends;

	console.log(tweets.length);
	for(let i = 0; i < tweets.length; i++) {
		let temp = [];
		temp.push(tweets[i].name);
		temp.push(tweets.length - i / 2);

		list.push(temp);
	}

	let hover = (a, b, c) => {
		c.target.style.cursor = "pointer";
	};

	let selectTweet = (item) => {
		let twitter = document.createElement("img");
		twitter.src = "./assets/img/twitter.png";
		twitter.style.cursor = "pointer";
		twitter.style.position = "absolute";
		twitter.style.top = "30px";
		twitter.style.left = "130px";
		twitter.id = "twitmark";
		twitter.onclick = (event) => {
			document.body.removeChild(document.getElementById("worldmap"));
			document.body.removeChild(document.getElementById("twitmark"));
			document.getElementById("twitter").innerHTML = "";
			document.getElementById("articles").style.display = "none";
			onRegionClick(null, null, region);
		};

		document.getElementById("label").innerHTML = item[0];
		document.getElementById("twitter").style.display = "none";

		document.body.appendChild(twitter);

		ipc.send('request-NYTimes-articles', item[0]);
		ipc.send('request-twitter-search', item[0]);
	};

	wordcloud(document.getElementById("twitter"), 
			{
				weightFactor: 4, 
				classes: 'tweet',
				color: 'sanggyu',
				fontFamily: 'Chela One',
				backgroundColor: 'transparent',
				list: list,
				hover: hover,
				click: selectTweet
			}
	);
});

ipc.on('get-twitter-search', (event, path) => {
	console.log(path);
});
