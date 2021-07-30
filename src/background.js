"use strict";
// import createMenu from '@/app/menu';
import { appUpdater, checkUpdate } from "@/app/updater";
import {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  //   Menu,
  crashReporter,
} from "electron";
// import path from 'path';
const fs = require("fs");
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
const gotTheLock = app.requestSingleInstanceLock(); // 只能启用一个应用程序
// app.disableHardwareAcceleration()
protocol.registerSchemesAsPrivileged([
  { scheme: "lead", privileges: { secure: true, standard: true } },
]);
let win = null;
async function createWindow() {
  //   const Menus = [];
  //   const mainMenu = Menu.buildFromTemplate(Menus);
  //   if (process.env.ENV !== "development") {
  //     Menu.setApplicationMenu(mainMenu);
  //   }
  //   app.dock.hide();
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    // titleBarStyle: 'hiddenInset',
    center: true, // 居中
    backgroundColor: "#262729",
    resizable: true, // 窗口是否可调整
    autoHideMenuBar: true,
    // fullscreen: true,
    webPreferences: {
      scrollBounce: true,
      //   devTools: process.env.ENV === "development" ? true : false, // 是否开启调试模式
      webSecurity: false,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
  });
  win.maximize(true);
  // win.webContents.openDevTools();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/#/");
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("lead");
    win.loadURL("lead://./index.html/#/");
  }
  win.on("close", (event) => {
    event.preventDefault();
    win.webContents.send("closed");
    ipcMain.on("exit", (e, data) => {
      if (data) {
        app.exit();
      }
    });
  });
}
ipcMain.on("message", (e, value) => {
  switch (value) {
    case "giveUp":
      win.setMinimumSize(900, 600);
      win.setBounds({ width: 1200, height: 700 });
      win.isResizable();
      win.setResizable(true);
      win.setMaximizable(true);
      win.maximize(true);
      break;
    case "clear":
      // 下载完就清除本地数据
      win.webContents.session.clearStorageData({
        storages: ["indexdb"],
      });
      break;
  }
});
ipcMain.on("devtool", () => {
  win.webContents.openDevTools();
});
ipcMain.on("saveFile", (event, data) => {
  saveFile(data, (params) => {
    event.returnValue = params;
  });
});
ipcMain.on("needUpgrade", (e, data) => {
  const { downUrl, needUpgrade } = data;
  if ((needUpgrade === "S" || needUpgrade === "Y") && downUrl) {
    appUpdater(win, data);
    checkUpdate();
    // } else {
    //   win.setMinimumSize(800, 500);
    //   win.setBounds({ width: 1200, height: 700 });
    //   win.isResizable();
    //   win.setResizable(true);
    //   win.setMaximizable(true);
    //   win.maximize(true);
  }
});
crashReporter.start({
  submitURL: "http://114.96.104.203:9000/mainLog",
  compress: true,
});
app.on("window-all-closed", () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // 创建 myWindow, 加载应用的其余部分, etc...
  app.whenReady().then(() => {
    // createMenu()
    createWindow();
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
function saveFile(data, cb) {
  //本地生成文件
  if (!data) return;
  const path = require("path").join(require("os").homedir(), "Desktop") + "/";
  let fileName = path + data[0] + ".md";
  //   if (!fs.existsSync(fileName)) {
  //     fs.mkdirSync(fileName);
  //   }
  fs.writeFile(fileName, data[1], function (err) {
    if (err) {
      cb({ status: false, msg: data[0] + ".md文件保存失败" });
      return;
    }
    cb({ status: true, msg: data[0] + ".md文件保存成功" });
  });
}
