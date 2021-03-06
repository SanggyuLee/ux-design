const ipc = require('electron').ipcRenderer

ipc.on('get-NYTimes-articles', function(event, args) {
	console.log(args);
	var timer = 0
	var opacity = 0

	function slow_motion() {
		opacity += 0.04
		document.getElementById("articles").style.opacity = opacity
	
		if(opacity >= 1)
			clearInterval(timer)
	}

	var articles = args.response.docs
	var output = '';
	for(var i = 0; i < articles.length; i++) {
		var img_src = ""
		var display = "none"
		var multimedia = articles[i].multimedia

		for(var j = 0; j < multimedia.length; j++) {
			if(multimedia[j].subtype === "thumbnail") {
				img_src = "http://www.nytimes.com/" + multimedia[j].url
				display = "inline"
				break;
			}
		}

		output += `
			<div class="article">
				<div class="thumbnail" style="display: ${display}">
					<img src=${img_src} />
				</div>

				<div class="content">
					<div class="headline">
						<div onclick="openArticle('${articles[i].web_url}')"> ${articles[i].headline.main} </div>
					</div>
	
					<div class="snippet">
						${articles[i].snippet}
					</div>

					<div class="copytoclip" onclick="urlCopy('${articles[i].web_url}')">
						Copy URL
					</div>
				</div>
			</div>
			`
		output += `<br>`

		console.log(articles[i].multimedia)
	}

	timer = setInterval(slow_motion, 50)

	document.getElementById("articles").style.opacity = opacity
	document.getElementById("articles").style.display = "flex"
	document.getElementById("articles").innerHTML = output
})
