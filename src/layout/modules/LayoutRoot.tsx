import { Link, Outlet } from 'react-router';

export const LayoutRoot = () => {

    return (
        <>
            <div className="p-4 flex un-justify-evenly m-b-10 un-border-dashed un-border-indigo-500 un-border">
                <Link to={'Home'}>Home</Link>
                <Link to={'HomeTest1'}>test</Link>
                <Link to={'xxxxasda'}>404测试</Link>
                <Link to={'ErrorData'}>监控报错</Link>
                <Link to={'AjaxData'}>监控接口</Link>
                <Link to={'Analyse'}>性能监控</Link>
                <Link to={'/child1/page1'}>嵌入应用1-页面1</Link>
                <Link to={'/child1/page2'}>嵌入应用1-页面2</Link>
                <Link to={'/child2/page'}>嵌入应用2-页面</Link>
                {/* <Link to={'ErrorData'}>用户行为监控</Link> */}
            </div>
            <Outlet />
        </>
    );
};
