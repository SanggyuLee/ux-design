const ipc = require('electron').ipcMain;

ipc.on('copy-url-to-clipboard', (event, url) => {
	const {clipboard} = require('electron');
	clipboard.writeText(url);
});
