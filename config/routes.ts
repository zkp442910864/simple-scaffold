
/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
const arr: IRouter[] = [
    {
        path: '/user/Login',
        component: './user/Login',
        name: '登录',
        layout: false,
        // access: '/',
    },
    {
        path: '/',
        component: './Home',
        name: '首页',
        // access: '/',
    },
    {
        path: '*',
        component: './StatusPage',
    },
];

// 把 access 转全小写，避免大小写问题
const accessToLocaleLowerCase = (data: IRouter[]) => {
    data.forEach((item) => {

        // access 转为字符串使用
        if (Array.isArray(item.access)) {
            item.access = item.access.join();
        }

        if (item.access) {
            item.access = item.access.toLocaleLowerCase();
        }

        if (item.routes) {
            accessToLocaleLowerCase(item.routes);
        }
    });

    return data;
};

export default accessToLocaleLowerCase(arr);

interface IRouter {
    /**
     * path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
     *
     * 访问路由，如果不是以 / 开头会拼接父路由
     */
    path?: string;
    /** 重定向 */
    redirect?: string;
    /**
     * 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
     *
     * 如果指向 src 目录的文件，可以用 @，也可以用 ../。比如 component: '@/layouts/basic'，或者 component: '../layouts/basic'，推荐用前者。
     */
    component?: string;
    /**
     * 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
     */
    routes?: Array<IRouter>;
    /**
     * 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。
     *
     * 好像可以做路由拦截
     */
    wrappers?: string[];
    /** 配置路由的标题 */
    name?: string;
    /** 图标 */
    icon?: string;
    /**
     * 权限，配置和路径一致就可以了
     *
     * 会根据返回的路由进行权限判断
     */
    access?: string | string[];
    /** 多语言 key */
    locale?: string;
    /** layout 布局 */
    layout?: boolean;
}

