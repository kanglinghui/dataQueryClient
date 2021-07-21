import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
export const appUpdater = (mainRender, { downUrl, needUpgrade }) => {
  autoUpdater.setFeedURL(downUrl)
  autoUpdater.autoDownload = false
  autoUpdater.on('error', (error) => {
    mainRender.webContents.send('error', error)
  })
  autoUpdater.once('update-available', (config) => {
    config.needUpgrade = needUpgrade
    mainRender.webContents.send('update-available', config)
  })

  autoUpdater.once('update-not-available', (config) => {
    mainRender.webContents.send('update-not-available', config)
  })

  autoUpdater.on('download-progress', function (progressObj) {
    mainRender.webContents.send('downloadProgress', progressObj)
  })
  ipcMain.on('startUpdate', () => {
    autoUpdater.downloadUpdate().then(res => {
    }).catch(error => {
      console.log('down-error', error)
    })
  })

  autoUpdater.once('update-downloaded', () => {
    mainRender.webContents.send('updateDownloaded')
    autoUpdater.quitAndInstall()
  })
}

export const checkUpdate = () => {
  if (process.env.NODE_ENV !== 'production') {
    autoUpdater.checkForUpdates()
  } else {
    autoUpdater.checkForUpdatesAndNotify()
  }
}
