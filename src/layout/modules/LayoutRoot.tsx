import { Link, Outlet } from 'react-router-dom';

export const LayoutRoot = () => {

    return (
        <div>
            <Link to={'Home'}>Home</Link>
            <Link to={'HomeTest1'}>HomeTest1</Link>
            <Link to={'HomeTest2'}>HomeTest2</Link>
            <Outlet />
        </div>
    );
};
