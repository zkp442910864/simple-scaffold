import { Link, Outlet } from 'react-router';

export const LayoutRoot = () => {

    return (
        <>
            <div className="p-4 flex un-justify-evenly m-b-10 un-border-dashed un-border-indigo-500 un-border">
                <Link to={'Home'}>Home</Link>
                {/* <Link to={'ErrorData'}>用户行为监控</Link> */}
            </div>
            <Outlet />
        </>
    );
};
