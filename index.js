'use strict';
const electron = require('electron');
const {app, ipcMain} = require('electron');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({
	showDevTools: 'left'
});


// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1400,
		height: 760
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	ipcMain.on('request', (event, arg) => {
		console.log('main:request', arg);
		setTimeout(() => {
			console.log('main:response', arg);
			event.sender.send('response', 'pong');
		}, 1000);
	});
});
