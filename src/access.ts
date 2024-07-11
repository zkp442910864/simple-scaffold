import {history} from 'umi';
import {InitialStateType} from '@@/plugin-initialState/@@initialState';

import rawRouters from '../config/routes';

/**
 * 获取所有路由中的 access 值
 *
 * 根据 access 来判断服务端菜单，决定页面是否展示
 */
function getRawRouterAccess (rawData: typeof rawRouters) {

    const judgeMap: Record<string, (map: TObj) => boolean> = {};

    // 获取权限值，做键值函数判断
    const handler = (data: typeof rawRouters) => {
        data.forEach((item) => {
            if (item.path && typeof item.access === 'string') {
                // 可能存在多个权限值
                const access = item.access as string;

                // 判断是否包含关系
                judgeMap[item.access] = (allMenuDataMap) => {
                    const strArr = access.split(',');
                    return strArr.some((path) => !!allMenuDataMap[path]);
                };
            }

            if (item.routes?.length) {
                handler(item.routes);
            }
        });
    };

    handler(rawData);

    return judgeMap;
}

/** 获取允许访问的页面 */
function getAllowPage (judgeMap: ReturnType<typeof getRawRouterAccess>, allMenuDataMap: TObj) {

    return Object.entries(judgeMap).reduce((map, [key, judgeFn]) => {
        map[key] = judgeFn(allMenuDataMap);
        return map;
    }, {} as TObj);
}

/** 按钮权限判断，以菜单维度处理 */
function operationCode (allMenuDataMap: TObj) {
    const fn: (code: string) => boolean = (code) => {

        const pageUrl = history.location.pathname;
        const menuItem = allMenuDataMap[pageUrl.toLocaleLowerCase()];

        if (!menuItem || !menuItem.operateCodes || !menuItem.operateCodes.length) return false;

        // 包含 A1 的话，说明是超级管理员
        return menuItem.operateCodes.includes(code) || menuItem.operateCodes.includes('A1');
    };

    return fn;
}

/** https://umijs.org/zh-CN/plugins/plugin-access */
export default function access (initialState: InitialStateType) {
    // console.log(initialState, rawRouters);
    const {
        // validMenuDataMap = {},
        allMenuDataMap = {},
    } = initialState || {};

    return {
        /** 按钮权限判断 */
        operaCodeCheck: operationCode(allMenuDataMap),
        /** 页面权限 */
        ...getAllowPage(getRawRouterAccess(rawRouters), allMenuDataMap),
    };
}

