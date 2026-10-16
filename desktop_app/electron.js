import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron/main';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// userData resolves to %APPDATA%\StockUp on Windows, ~/Library/Application Support/StockUp on macOS
app.setName('StockUp');

let mainWindow = null;
let dbPath = null;

// Keep the database in the per-user app data folder so it survives reinstalls and isn't tied to the
// working directory. Databases created by older versions next to electron.js are copied over once.
function resolveDatabasePath() {
	const target = path.join(app.getPath('userData'), 'inventory.db');
	const legacy = path.join(__dirname, 'inventory.db');
	if (!fs.existsSync(target) && fs.existsSync(legacy)) {
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.copyFileSync(legacy, target);
		console.log(`Copied existing database from ${legacy} to ${target}`);
	}
	return target;
}

ipcMain.on('stockup:get-db-path', (event) => {
	event.returnValue = dbPath;
});

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 760,
		minWidth: 960,
		minHeight: 640,
		title: 'StockUp',
		// Taskbar / dock icon (also where electron-builder looks for the app icon)
		icon: path.join(__dirname, 'build', 'icon.png'),
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
	dbPath = resolveDatabasePath();
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
