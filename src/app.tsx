import {RunTimeLayoutConfig, createSearchParams, history} from 'umi';

import Footer from '@/layouts/Footer';
import RightContent from '@/layouts/RightContent';
import StatusPage from '@/pages/StatusPage';
import {handlerMenuData, handlerDictionaries} from '@/utils/base/init';
import {getMenuDataApi, getUserDataApi, getDictionariesApi} from '@/services/commonApi';

console.log('app');

/** https://umijs.org/zh-CN/plugins/plugin-initial-state */
export async function getInitialState () {
    let menuData: TObj[] = [];
    let dictionaries: ReturnType<typeof handlerDictionaries>['mapData'] = {};
    let getDictionData: ReturnType<typeof handlerDictionaries>['getDictionData'] = () => [];
    let [validMenuDataMap, allMenuDataMap, userData] = [{}, {}, {}] as TObj[];

    try {

        // TODO: 前置请求，注意报错处理
        const [res1, res2, res3] = await Promise.all<TObj[]>([
            getMenuDataApi(),
            getUserDataApi(),
            getDictionariesApi(),
        ]);

        // await new Promise((rel) => {
        //     setTimeout(() => {
        //         rel();
        //     }, 10000);
        // });

        const data1 = await res1.json();
        const data2 = await res2.json();
        const data3 = await res3.json();

        ({menuData, validMenuDataMap, allMenuDataMap} = await handlerMenuData(data1.data));
        const {mapData, getDictionData: getDictionDataFn} = handlerDictionaries(data3.data);
        dictionaries = mapData;
        getDictionData = getDictionDataFn;
        userData = data2.data;
    } catch (error) {
        console.error(error);
    }

    return {
        /** 用户数据 */
        userData,
        /** 菜单数据 */
        menuData,
        /** 有效菜单映射 */
        validMenuDataMap,
        /** 所有菜单映射，包括 children */
        allMenuDataMap,
        /** 字典数据(一次性拿下所有数据) */
        dictionaries,
        /** 获取字典数据的函数 */
        getDictionData,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = (initData) => {

    const {initialState} = initData || {};
    const queryData = createSearchParams(history.location.search);
    const hideLeft = queryData.get('hideLeft') === '1';
    const hideTop = queryData.get('hideTop') === '1';
    const hideAll = queryData.get('hideAll') === '1';

    return {
        title: 'x-system',
        logo: './favicon.png',
        menu: {
            locale: false,
        },
        notFound: <StatusPage code={404} />,
        noAccessible: <StatusPage code={403} />,
        logout: () => {
            // console.log('退出逻辑', 1);
            history.replace('/user/Login');
        },
        // 底部
        footerRender: () => <Footer />,
        // 顶部右边栏
        rightContentRender: () => <RightContent />,
        // 传入菜单数据
        menuDataRender: () => {
            return initialState?.menuData || [];
        },
        // 每打开一个路由触发
        onPageChange: (location) => {
            // console.log(initialState);
            console.log('进入');
        },
        style: {
            minHeight: '100vh',
        },
        // 顶部高度
        headerHeight: 55,
        // 右部菜单栏宽度
        siderWidth: 255,
        // 布局
        layout: 'mix',
        // 固定头部
        fixedHeader: true,
        // 固定右部
        fixSiderbar: true,

        // 显示，自定义 头部
        // headerRender: false,
        // 显示，自定义 菜单
        // menuRender: false,
        ...(hideLeft ? {layout: 'top'} : {}),
        ...(hideTop ? {layout: 'side'} : {}),
        ...(hideAll ? {menuRender: false, headerRender: false, footerRender: false} : {}),
    };
};
