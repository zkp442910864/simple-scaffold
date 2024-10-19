import { Link, Outlet } from 'react-router-dom';

export const LayoutRoot = () => {

    return (
        <>
            <div className="p-4 flex un-justify-evenly m-b-10 un-border-dashed un-border-indigo-500 un-border">
                <Link to={'Home'}>Home</Link>
                <Link to={'HomeTest1'}>test</Link>
                <Link to={'xxxxasda'}>404测试</Link>
                <Link to={'ErrorData'}>监控数据</Link>
            </div>
            <Outlet />
        </>
    );
};