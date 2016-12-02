const ipc = require('electron').ipcRenderer;
const wordcloud = require('WordCloud');

console.log(wordcloud);
console.log(wordcloud.isSupported);

ipc.send('request-twitter-country', '');

ipc.on('get-twitter-country', function(event, tweets) { 
	let onRegionClick = (element, code, region) => {
		let isExist = false;
		for(let i = 0; i < tweets.length; i++) {
			if(tweets[i].name === region) {
				isExist = true;
				document.body.style.display = "relative";
				document.getElementById("vmap").style.display = "none";
				let bar = document.getElementById("bar");
				bar.style.display = "flex";

				let worldmap = document.createElement("img");
				worldmap.src = "./assets/img/worldmap.png";
				worldmap.style.cursor = "pointer";
				worldmap.id = "worldmap";
				worldmap.onclick = (event) => {
					location.reload();
				};

				let label = document.getElementById("label");
				label.innerHTML = region;

				bar.appendChild(worldmap);

				document.getElementById("twitter").style.display = "flex";
				ipc.send('request-twitter-trend', tweets[i].woeid);

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
//
//	let list = [];
//
//	let rank = 0;
//	for(let i = 0; i < tweets.length; i++) {
//		if(tweets[i].placeType.code !== 7) {
//			let temp = [];
//			temp.push(tweets[i].name);
//			temp.push(13);
//
//			list.push(temp);
//		}
//	}
//
//	let selectCountry = (item) => {
//		console.log("item:" + item[0]);
//		for(let i = 0; i < tweets.length; i++) {
//			if(tweets[i].name === item[0]) {
//				console.log(tweets[i]);
//				ipc.send('request-twitter-trend', tweets[i].woeid);
//				break;
//			}
//		}
//	};
//
//	wordcloud(document.getElementById("twitter"), 
//			{
//				gridSize: 10, 
//				color: 'sanggyu',
//				weightFactor: 4, 
//				classes: 'tweet',
//				backgroundColor: 'transparent',
//				fontFamily: 'Chela One',
//				list: list,
//				hover: hover,
//				click: selectCountry
//			}
//	);
});

ipc.on('get-twitter-trend', (event, path) => {
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
		console.log(a);
		console.log(b);
		console.log(c);
	};

	let selectTweet = (item) => {
		console.log(item);
		document.getElementById("label").innerHTML = item[0];
		document.getElementById("twitter").style.display = "none";
		ipc.send('request-NYTimes-articles', item[0]);
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
