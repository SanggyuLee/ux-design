const ipc = require('electron').ipcRenderer;
const wordcloud = require('WordCloud');

console.log(wordcloud);
console.log(wordcloud.isSupported);

ipc.send('request-twitter-trend', '');

ipc.on('get-twitter-trend', function(event, path) {
	console.log(path);
	let object = path[0].trends;
	let output = '';
	for(let i = 0; i < object.length; i++) {
		if(i == 10)
			break;

		output += `<button type="button" id="${object[i].name}">${object[i].name}</button>`;
	}

	let timer = 0;
	let opacity = 0;

	function slow_motion() {
		opacity += 0.04;
		document.querySelector(".twitter-result-box").style.opacity = opacity;
	
		if(opacity >= 1)
			clearInterval(timer);
	}

	timer = setInterval(slow_motion, 50);

	document.querySelector(".twitter-result-box").style.opacity = opacity;
	document.querySelector(".twitter-result-box").style.display = "flex";
	document.querySelector(".twitter-result-box").innerHTML = output;

	let list = [];

	for(let i = 0; i < object.length; i++) {
		let temp = [];
		temp.push(object[i].name);
		temp.push(object.length - i);

		list.push(temp);
	}

	wordcloud(document.getElementById("twitter"), {gridSize: 10, weightFactor: 3, list: list});
});
