'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))
const BrowserWindow = electron.BrowserWindow
var mainWindow = null
var nama_aplikasi = config.productName+" v"+config.version;

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer32.dll'
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, 'app', 'library', pluginName))

app.setName(nama_aplikasi)
app.on('ready', function () {
    mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        backgroundColor: 'lightgray',
        title: nama_aplikasi,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            defaultEncoding: 'UTF-8'
        }
    })

    mainWindow.maximize()

    mainWindow.setMenuBarVisibility(false)

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    // Enable keyboard shortcuts for Developer Tools on various platforms.
    // let platform = os.platform()
    // if (platform === 'darwin') {
    //     globalShortcut.register('Command+Option+I', () => {
    //         mainWindow.webContents.openDevTools()
    //     })
    // } else if (platform === 'linux' || platform === 'win32') {
    //     globalShortcut.register('Control+Shift+I', () => {
    //         mainWindow.webContents.openDevTools()
    //     })
    // }

    mainWindow.once('ready-to-show', () => {
        mainWindow.setMenu(null)
        mainWindow.show()
    })

    mainWindow.onbeforeunload = (e) => {
        // Prevent Command-R from unloading the window contents.
        e.returnValue = false
    }

    mainWindow.on('closed', function () {
        mainWindow = null
    })
})

app.on('window-all-closed', () => { app.quit() })
