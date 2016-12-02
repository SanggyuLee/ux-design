const path = require('path');
const glob = require('glob');
const electron = require('electron');

const app = electron.app;
const browserWindow = electron.BrowserWindow;

const debug = /--debug/.test(process.argv[2]);

let mainWindow = null;

function initialize() {
	loadDemos();

	function createWindow() {
		var windowOptions = {
			width: 1280,
			minWidth: 680,
			height: 840,
		};

		if(process.platform == 'linux') {
			// Icon
		}

		mainWindow = new browserWindow(windowOptions);
		mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));
		mainWindow.maximize();

		if(debug) {
			mainWindow.webContents.openDevTools();
			require('devtron').install();
		}

		mainWindow.on('closed', function() {
			mainWindow = null;
		})
	}

	app.on('ready', function() {
		createWindow();
	});

	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', function () {
		if (mainWindow === null) {
			createWindow()
		}
	});
}

initialize();

function loadDemos () {
	var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'));
	files.forEach(function (file) {
	     require(file)
	});
}
