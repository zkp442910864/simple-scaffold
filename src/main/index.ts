import { app, shell, BrowserWindow, ipcMain, Menu, Tray, screen } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../build/icon.ico?asset';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

class Main {

    // isBoxDev = is.dev;
    isBoxDev = true;
    mainWindow: InstanceType<typeof BrowserWindow> | null = null;
    floatWindow: InstanceType<typeof BrowserWindow> | null = null;


    constructor() {
        dayjs.extend(duration);

        // 这段程序将会在 Electron 结束初始化
        // 和创建浏览器窗口的时候调用
        // 部分 API 在 ready 事件触发后才能使用。
        void app.whenReady().then(() => {
            // 为windows设置应用用户模型id
            electronApp.setAppUserModelId('com.electron.vite-electron');

            this.createMainWindow();

            this.appEvent();
        });


        // 在当前文件中你可以引入所有的主进程代码
        // 也可以拆分成几个文件，然后用 require 导入。
    }

    createMainWindow() {
        // 创建浏览器窗口。
        const mainWindow = this.mainWindow = new BrowserWindow({
            ...this.isBoxDev
                ? { width: 1430, height: 1000, }
                : {
                    width: 900,
                    height: 800,
                    /** 窗口是否可调整大小 */
                    resizable: false,
                    /** 自动隐藏菜单栏，除非Alt键已按下。 */
                    autoHideMenuBar: true,
                    /** 创建一个有框窗口。 */
                    frame: false,
                    /** 使窗口透明 */
                    transparent: true,
                },
            show: true,
            title: '计时器',
            icon,
            webPreferences: {
                preload: join(__dirname, '../preload/index.mjs'),
                sandbox: false,
                // contextIsolation: true,
                // nodeIntegration: false,
            },
        });

        mainWindow.on('ready-to-show', () => {
            this.isBoxDev && mainWindow.show();

            ipcMain.on('mainWindowMinimize', () => {
                mainWindow?.minimize();
            });
        });

        // mainWindow.webContents.setWindowOpenHandler((details) => {
        //     void shell.openExternal(details.url);
        //     return { action: 'deny', };
        // });

        // 基于electron-vite cli的渲染器的HMR。
        // 加载用于开发的远程URL或用于生产的本地html文件。
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            void mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
            mainWindow.webContents.openDevTools();
        }
        else {
            void mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
            // 指定路由
            // void mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: 'home' })
        }
    }

    /** app 的监听事件 */
    appEvent() {
        // 默认在开发中由F12打开或关闭DevTools
        // 并忽略生产中的CommandOrControl R。
        // 参见 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });


        // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
        // 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
        // 直到用户使用 Cmd + Q 明确退出
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // 在 macOS 系统内, 如果没有已开启的应用窗口
            // 点击托盘图标时通常会重新创建一个新窗口
            if (BrowserWindow.getAllWindows().length === 0) this.createMainWindow();
        });
    }

}


new Main();