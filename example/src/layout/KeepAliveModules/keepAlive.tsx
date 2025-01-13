
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router';
import { useRouter } from '@/router';
import { NoFindPage } from '../modules/NoFindPage';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorComponent } from '../modules/ErrorComponent';

export class KeepAlive {
  static instance: KeepAlive;

  id = `keep-alive-${parseInt(Math.random() * 100000 + '')}`;
  /** 容器dom */
  private contentDom?: HTMLElement;
  /** 容器组件更新 */
  private contentUpdate?: (data: object) => void;
  /** keep-alive 存储数据 */
  private keepAliveData = {
    /** 页面 keep-alive */
    pages: [] as IPageData[],
    /** 对应pages 的映射关系 */
    pageMap: {} as Record<string, IPageData | undefined>,
    /** 对应页面的回调收集 */
    pageLifeCycle: {} as Record<string, {callback?: IPageLifeCycleCallback, notification?: () => void} | undefined>,
    /** 当前激活页面 */
    currentPathname: '',
    lastLocation: undefined as ReturnType<typeof useLocation> | undefined,
  };

  static getInstance() {
    if (!KeepAlive.instance) {
      KeepAlive.instance = new KeepAlive();
    }
    return KeepAlive.instance;
  }

  private constructor() {}

  /** 关闭页面 */
  closePage(assignKey: string) {
    if (assignKey && this.keepAliveData.pageMap[assignKey]) {
      const data = this.keepAliveData.pageMap[assignKey];
      const index = this.keepAliveData.pages.indexOf(data);

      this.keepAliveData.pageMap[assignKey] = undefined;
      index > -1 && this.keepAliveData.pages.splice(index, 1);
      this.keepAliveData.pageLifeCycle[assignKey] = undefined;

      index > -1 && this.contentUpdate?.({});
    }
  }

  /** 关闭所有页面 */
  closeAllPage(retainKeys?: string[]) {
    const keepAliveData: typeof this.keepAliveData = {
      pages: [],
      pageMap: {},
      pageLifeCycle: {},
      currentPathname: this.keepAliveData.currentPathname,
      lastLocation: this.keepAliveData.lastLocation,
    };

    retainKeys?.forEach((key) => {
      keepAliveData.pageMap[key] = this.keepAliveData.pageMap[key];
      keepAliveData.pageLifeCycle[key] = this.keepAliveData.pageLifeCycle[key];
      keepAliveData.pages.push(keepAliveData.pageMap[key]!);
    });

    this.keepAliveData = keepAliveData;
    this.contentUpdate?.({});
  }

  /** 关闭其他页面(除了当前路径的保留，可以传入参数保留额外的) */
  closeOtherPage(retainKeys?: string[]) {
    this.closeAllPage([this.keepAliveData.currentPathname,].concat(retainKeys || []));
  }

  /** 刷新页面 */
  refreshPage(assignKey: string) {
    // 跳中转页，移除，再重定向回来
    this.closePage(assignKey);
    setTimeout(() => {
      this.updateCurrentPage();
    }, 0);
  }

  /** hooks 回调页面 初次加载 或 再次加载，以及参数的变化 */
  useLifeCycle = (callback: IPageLifeCycleCallback) => {
    // const local = useLocation();
    const lock = useRef(false);
    const fn = useCallback(() => {
      const map = this.keepAliveData.pageLifeCycle;
      const key = this.keepAliveData.currentPathname;
      const oldMap = map[key];

      if (!oldMap || !oldMap.callback) {
        map[key] = { ...oldMap, callback, };
        map[key]?.notification?.();
      }
    }, []);

    !lock.current && fn();

    useEffect(() => {
      lock.current = true;
    }, []);
  };

  /** 更新当前路由页面 */
  updateCurrentPage() {
    const keepAliveData = this.keepAliveData;
    const pathname = this.keepAliveData.lastLocation!.pathname;
    if (keepAliveData.currentPathname === pathname && keepAliveData.pageMap[pathname]) {
      const key = keepAliveData.currentPathname;
      const obj = keepAliveData.pageLifeCycle[key];
      obj?.callback?.(ELifeCycleType.SEARCH, this.keepAliveData.lastLocation!);
      return;
    }

    if (!keepAliveData.pageMap[pathname]) {
      keepAliveData.pageMap[pathname] = this.keepAliveData.lastLocation;
      keepAliveData.pages.push(this.keepAliveData.lastLocation!);
    }

    keepAliveData.currentPathname = pathname;
        this.contentUpdate!({});
  }

  /** 根渲染容器组件 */
  Content = () => {
    const local = useLocation();
    const keepAliveData = this.keepAliveData;
    const [, update,] = useState({});
    this.contentUpdate = update;
    this.keepAliveData.lastLocation = local;

    useEffect(() => {
      this.contentDom = document.getElementById(this.id)!;
    }, []);

    useEffect(() => {
      this.updateCurrentPage();
    }, [local.pathname, local.hash, local.search,]);

    return (
      <>
        <div id={this.id}></div>
        {
          keepAliveData.pages.map((item) =>
            <this.KeepAliveItem key={item.pathname} idKey={item.pathname} activate={keepAliveData.currentPathname === item.pathname} />
          )
        }
      </>
    );
  };

  /** 页面挂载组件 */
  private KeepAliveItem: FC<{activate: boolean, idKey: string}> = ({
    activate,
    idKey,
  }) => {

    const page = useRouter();
    const [, update,] = useState({});
    const { current: cache, } = useRef({
      div: document.createElement('div'),
      portal: null as null | ReturnType<typeof createPortal>,
      /** 是否挂载 */
      mount: false,
      /** 首次加载 */
      firstMount: true,
      /** 开启生命周期回调 */
      useLifeCycle: false,
    });
    const lifeCycle = this.keepAliveData.pageLifeCycle[idKey] = {
      ...this.keepAliveData.pageLifeCycle[idKey],
      notification: () => {
        if (this.keepAliveData.pageLifeCycle[idKey]?.callback) {
          this.keepAliveData.pageLifeCycle[idKey].callback(ELifeCycleType.BEFORE_MOUNT, this.keepAliveData.lastLocation!);
          cache.useLifeCycle = true;
          // 不这样处理，严格模式下报错
          setTimeout(() => {
            update({});
          }, 0);
        }
      },
    };

    useEffect(() => {
      if (activate && this.contentDom) {
        cache.portal = cache.portal || createPortal(
          <ErrorBoundary
            fallbackRender={({ error, }) =>
              <>
                <ErrorComponent outError={error as unknown}/>
                <button onClick={() => this.refreshPage(idKey)}>刷新页面</button>
              </>
            }
          >
            {page?.element || <NoFindPage/>}
          </ErrorBoundary>,
          cache.div
        );
        this.contentDom.appendChild(cache.div);
        cache.mount = true;
      }
      else {
        cache.div.remove();
        cache.mount = false;
      }
      update({});
    }, [activate, this.contentDom,]);

    // 生命周期 判断
    useEffect(() => {
      if (!cache.useLifeCycle || !lifeCycle.callback) return;

      if (activate && cache.firstMount) {
        cache.firstMount = false;
        lifeCycle.callback?.(ELifeCycleType.MOUNTED, this.keepAliveData.lastLocation!);
      }
      else if (activate && cache.mount) {
        lifeCycle.callback?.(ELifeCycleType.ACTIVATED, this.keepAliveData.lastLocation!);
      }
      else {
        lifeCycle.callback?.(ELifeCycleType.DEACTIVATED);
      }
    }, [cache.useLifeCycle, cache.mount,]);

    useEffect(() => {
      if (!cache.useLifeCycle || !lifeCycle.callback) return;

      return () => {
        this.closePage(idKey);
        lifeCycle.callback?.(ELifeCycleType.UNMOUNTED);
      };
    }, [cache.useLifeCycle,]);

    return cache.portal;
  };

}

interface IPageData {
    pathname: string;
}

interface IPageLifeCycleCallback {
    (type: ELifeCycleType.BEFORE_MOUNT, local: ReturnType<typeof useLocation>): void;
    (type: ELifeCycleType.MOUNTED, local: ReturnType<typeof useLocation>): void;
    (type: ELifeCycleType.ACTIVATED, local: ReturnType<typeof useLocation>): void;
    (type: ELifeCycleType.SEARCH, local: ReturnType<typeof useLocation>): void;
    (type: ELifeCycleType.DEACTIVATED | ELifeCycleType.UNMOUNTED, local?: ReturnType<typeof useLocation>): void;
}
enum ELifeCycleType {
    /** 挂载前 */
    BEFORE_MOUNT = 'beforeMount',
    /** 挂载后 */
    MOUNTED = 'mounted',
    /** 激活 */
    ACTIVATED = 'activated',
    /** 停用 */
    DEACTIVATED = 'deactivated',
    // BEFORE_UNMOUNTED = 'beforeUnmounted',
    /** 卸载 */
    UNMOUNTED = 'unmounted',
    /** search发生变化 */
    SEARCH = 'search',
};
