import { app, BrowserWindow } from 'electron/main';

let mainWindow = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 760,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
		console.error('Window failed to load:', errorCode, errorDescription);
	});

	mainWindow.loadURL('http://localhost:5173').catch((error) => {
		console.error('Failed to open Vite URL:', error);
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
