import { app, BrowserWindow, nativeTheme } from 'electron/main';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 760,
		minWidth: 960,
		minHeight: 640,
		title: 'StockUp',
		// Match the surface token so there is no white flash before the UI paints
		backgroundColor: nativeTheme.shouldUseDarkColors ? '#101112' : '#FFFFFF',
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

	// Open DevTools for debugging
	mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	process.chdir(__dirname);
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
