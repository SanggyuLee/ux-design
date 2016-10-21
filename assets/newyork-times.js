const ipc = require('electron').ipcRenderer

ipc.on('get-NYTimes-articles', function(event, args) {
	var timer = 0
	var opacity = 0

	function slow_motion() {
		opacity += 0.04
		document.querySelector(".article-box").style.opacity = opacity
	
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
						<a href="${articles[i].web_url}"> ${articles[i].headline.main} </a>
					</div>
	
					<div class="snippet">
						${articles[i].snippet}
					</div>
				</div>
			</div>
			`
		output += `<br>`

		console.log(articles[i].multimedia)
	}


	timer = setInterval(slow_motion, 50)

	document.querySelector(".article-box").style.opacity = opacity
	document.querySelector(".article-box").style.display = "flex"
	document.querySelector(".article-box").innerHTML = output
})
