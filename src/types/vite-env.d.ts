/// <reference types="vite/client" />

import { IpcRendererEvent } from 'electron';
import { ElectronAPI } from '@electron-toolkit/preload';

declare global {

    type TTimerUpdateCallback = (event: IpcRendererEvent, data: {time: number, status: boolean, autoStart: false, logArr: string[]}) => void;

    interface Window {
        electron: ElectronAPI
        api: unknown
    }
}
