const { app, dialog, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { spawn } = require('child_process');
const https = require('https');
const fs = require('fs');

let mainWindow;

const gameUpdates = {
    'WoW 335a': {
        version: '1.1',
        downloadUrl: 'https://yourserver.com/games/game1.zip'
    },
    'BWO': {
        version: '1.0',
        downloadUrl: 'https://yourserver.com/games/game1.zip'
    },
    // Add more games and their update URLs as needed
};

function checkForUpdates() {
    const gameVersionEndpoint = 'https://yourserver.com/api/game/version';
    fetch(gameVersionEndpoint)
        .then(response => response.json())
        .then(data => {
            const { name, version, downloadUrl } = data;
            const localVersion = getLocalVersion(name);
            if (localVersion !== version) {
                downloadUpdate(name, downloadUrl);
            }
        })
        .catch(error => {
            console.error('Error checking for updates:', error);
        });
}

function getLocalVersion(game) {
    // Logic to get the local version number for a game
    return '1.0'; // Sample version number
}

function downloadUpdate(game, url) {
    const file = fs.createWriteStream(`${app.getPath('userData')}/updates/${game}.zip`);
    https.get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            applyUpdate(game);
        });
    }).on('error', err => {
        console.error('Error downloading update:', err);
    });
}

function applyUpdate(game) {
    // Logic to extract and apply the update (e.g., unzip, replace files)
    dialog.showMessageBox({
        type: 'info',
        message: `Update for ${game} downloaded and applied successfully!`,
        buttons: ['OK']
    });
}
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('html/index.html');
    // Create a custom menu template
    const template = [
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        }
    ];

    // Set the application menu
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        message: 'A new update is available. Downloading now...',
        buttons: []
    });
});

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});
app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
	//checkForUpdates();
    // Create window...
	createWindow();
    ipcMain.on('launch-game', (event, gamePath) => {
        const gameProcess = spawn(gamePath, [], {
            detached: true,
            stdio: 'ignore'
        });
        gameProcess.unref();
    });
});

ipcMain.on('close-window', () => {
    console.log('Received close-window event.');
    if (mainWindow) {
        mainWindow.close();
    } else {
        console.log('Main window is null.');
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});