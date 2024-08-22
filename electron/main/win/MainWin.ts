import { app, BrowserWindow, shell, Menu, ipcMain } from 'electron'
import { join, resolve } from 'node:path'
import { NodeMediaWin } from './NodeMediaWin';
import { AboutWin } from './AboutWin';
import { KeyWin } from './KeyWin';
import { Tools } from '../utils';
import { Listeners } from '../listeners';
import log  from 'electron-log';
import { fork } from 'child_process';
import { getPort } from "portfinder";
import { MEDIA_SERVER_RTMP_PORT, LIVE_PORT, DANMAKU_PORT } from "../config/index";
import Store from 'electron-store';
import { MainBrowserWin } from "../types/index";
import { checkAndOperatePorts } from '../utils/system';

export class MainWin {
  private win: MainBrowserWin | null = null;
  public constructor() {
    const preload = join(__dirname, '../preload/index.js')
    const url = process.env.VITE_DEV_SERVER_URL
    const indexHtml = join(process.env.DIST, 'index.html')
    this.win = new BrowserWindow({
      title: 'Partner48',
      icon: join(process.env.PUBLIC, 'favicon.ico'),
      webPreferences: {
        preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true
      },
    });
    this.win.menuBarVisible = false;
    this.win.childProcessArray = [];
    this.win.isExit = false;

    this.win.on("closed", async () => {
      this.win && (this.win.isExit = true);
      while(this.win?.videoWinList && this.win?.videoWinList.length > 0) {
        const item = this.win.videoWinList[0];
        if(item.videoWin || !item.videoWin.isDestroyed()){
          item.videoWin.close();
        }
      }
      const childProcessArray = this.win?.childProcessArray.reverse() || [];
      await Promise.all(childProcessArray.map(async item => {
        return await Tools.killProcess(item.pid);
      }));
      app.emit("window-all-closed");
    });

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
      this.win.loadURL(url)
      // Open devTool if the app is not packaged
      this.win.webContents.openDevTools()
    } else {
      this.win.loadFile(indexHtml)
    }

    const store = new Store();
    store.set('port', {
      MEDIA_SERVER_RTMP_PORT: MEDIA_SERVER_RTMP_PORT,
      LIVE_PORT: LIVE_PORT,
      DANMAKU_PORT: DANMAKU_PORT
    });

    checkAndOperatePorts(Object.values(store.get('port'))).then((res: number[]) => {
      res.forEach((port, index) => {
        store.set('port.' +Object.keys(store.get('port'))[index], port)
      });
      console.log(store.get('port'));
      this.runMediaServer(store.get('port.MEDIA_SERVER_RTMP_PORT'), store.get('port.LIVE_PORT'));
      this.runDanmuServer(store.get('port.DANMAKU_PORT'));
    });

    //IPC
    new Listeners(this.win);
    // this.runServerAndGetPort().then(data => {
    //   if(typeof data !== 'object') {
    //     return;
    //   }
    //   const store = new Store();
    //   Object.keys(data).forEach(item => {
    //     store.set(item, data[item]);
    //   });
    // });

    // Test actively push message to the Electron-Renderer
    this.win.webContents.on('did-finish-load', () => {
      this.win?.webContents.send('main-process-message', new Date().toLocaleString())
    })
  
    // Make all links open with the browser, not with the application
    this.win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
    })
  }
  public getWin () {
    return this.win;
  }
  async testPorts() {
    try {
      const info:any = await Tools.findPort('8936');
      const result = await Tools.killPort(info.pId);
      log.info(Buffer.from(result as Buffer).toString());
    } catch (e) { }
    try {
      const info:any = await Tools.findPort('8935');
      const result = await Tools.killPort(info.pId);
      log.info(Buffer.from(result as Buffer).toString());
    } catch (e) { }
    try {
      const info:any = await Tools.findPort('8173');
      const result = await Tools.killPort(info.pId);
      log.info(Buffer.from(result as Buffer).toString());
    } catch (e) { }
  }

  forkChild(tsFile, argvs) {
    const child = fork(tsFile, argvs, {
      silent: true
    });
    child.stdout.on('data', (result) => {
      const res = Buffer.from(result).toString();
      log.info(res);
      if(tsFile.indexOf('MediaServer') > -1 &&
        res.indexOf("[rtmp publish] Close stream.") > -1) {
        const liveId = res.match(/live\/(.*?)\s/)?.[1];
        ipcMain.emit('main-ffmpeg-server-close', true, liveId);
      }
    });
    child.stderr.on('data', (result) => {
      log.error(Buffer.from(result).toString());
    });
    child.on('exit', () => {
      console.log(new Date());
      if(!this.win.isExit) {
        console.log(new Date(),this.win.isExit)
        setTimeout(() => {
          this.win.childProcessArray.splice(this.win.childProcessArray.indexOf(child), 1);
          this.forkChild(tsFile, argvs);
        }, 1000);
      }
    });
    this.win.childProcessArray.push(child);
  }

  runMediaServer(rtmp_port, http_port) {
    const mediaServerFile = resolve(join(__dirname, 'worker',`MediaServer.js`)).replace(/\\/g, '/');
    this.forkChild(mediaServerFile, [rtmp_port, http_port]);
  }

  runDanmuServer(port) {
    const danmuServerFile = resolve(join(__dirname, 'worker', `DanmuServer.js`)).replace(/\\/g, '/');;
    this.forkChild(danmuServerFile, [port]);
  }
}