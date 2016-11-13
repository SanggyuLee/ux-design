const ipc = require('electron').ipcRenderer

ipc.send('request-twitter-trend', '')
ipc.on('get-twitter-trend', function(event, path) {
	var object = path[0].trends
		var output = '';
	for(var i = 0; i < object.length; i++) {
		if(i == 10)
			break;

		if(object[i].name.charAt(0) === '#') {//해시태그가 있는 단어는 검색이 잘 안됨
			object[i].name = object[i].name.substring(1,object[i].name.length); // 해시태그 제거

			var trim_result = "";
			var temp = object[i].name.toUpperCase();
			var forfirst = false;

			for(var j = 1; j < object[i].name.length ; j++) {
				if(temp.charAt(j) != object[i].name.charAt(j) && temp.charAt(j+1) == object[i].name.charAt(j+1)) {
					if(forfirst == false) {
						trim_result = object[i].name.substring(0,j);
						forfirst = true;
					}
					trim_result = trim_result + object[i].name.charAt(j) + " ";
				}//대문자와 소문자 사이에 띄어쓰기 넣어 검색이 용이하도록!
				else {
					trim_result = trim_result + object[i].name.charAt(j);
				}
			}
			object[i].name = trim_result;
		}

		output += `<button type="button" id="${object[i].name}">${object[i].name}</button>`
	}

	var timer = 0
		var opacity = 0

		function slow_motion() {
			opacity += 0.04
				document.querySelector(".twitter-result-box").style.opacity = opacity

				if(opacity >= 1)
					clearInterval(timer)
		}

	timer = setInterval(slow_motion, 50)

		document.querySelector(".twitter-result-box").style.opacity = opacity
		document.querySelector(".twitter-result-box").style.display = "flex"
		document.querySelector(".twitter-result-box").innerHTML = output
})
