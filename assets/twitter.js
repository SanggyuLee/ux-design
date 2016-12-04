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
				document.getElementById("banner").style.display = "none";

				let worldmap = document.createElement("img");
				worldmap.src = "./assets/img/worldmap.png";
				worldmap.style.cursor = "pointer";
				worldmap.style.position = "absolute";
				worldmap.style.top = "30px";
				worldmap.style.left = "30px";
				worldmap.id = "worldmap";
				worldmap.onclick = (event) => {
					location.reload();
					document.getElementById("banner").style.display = "initial";
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
		let back = document.createElement("img");
		back.src = "./assets/img/back.png";
		back.style.cursor = "pointer";
		back.style.position = "absolute";
		back.style.top = "46px";
		back.style.left = "142px";
		back.id = "twitmark";
		back.onclick = (event) => {
			document.body.removeChild(document.getElementById("worldmap"));
			document.body.removeChild(document.getElementById("twitmark"));
			document.getElementById("twitter").innerHTML = "";
			document.getElementById("articles").style.display = "none";
			onRegionClick(null, null, region);
		};

		document.getElementById("label").innerHTML = item[0];
		document.getElementById("twitter").style.display = "none";

		document.body.appendChild(back);

		ipc.send('request-NYTimes-articles', item[0]);
		ipc.send('request-twitter-search', item[0]);
	};

	wordcloud(document.getElementById("twitter"), 
			{
				weightFactor: 4, 
				classes: 'tweets',
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

	var timer = 0;
	var opacity = 0;

	function slow_motion() {
		opacity += 0.04;
		document.getElementById("tweets").style.opacity = opacity;
	
		if(opacity >= 1)
			clearInterval(timer);
	}

	timer = setInterval(slow_motion, 50);

	let tweets = path.statuses;
	let output = '';
	for(let i = 0; i < tweets.length; i++) {
		output += `
			<div class="tweet">
				<div class="thumbnail" style="display: inline">
					<img src=${tweets[i].user.profile_image_url} />
				</div>

				<div class="content">
					<div class="headline">
						<div onclick="openArticle('${tweets[i].user.url}')"> ${tweets[i].user.name} </div>
					</div>

					<div class="snippet">
						${tweets[i].text}
					</div>
				</div>
			</div>
			<br>
			`
	}

	document.getElementById("tweets").style.opacity = opacity
	document.getElementById("tweets").style.display = "flex"
	document.getElementById("tweets").innerHTML = output
});
