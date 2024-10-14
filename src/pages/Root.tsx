import { Link, Outlet } from 'react-router-dom';

const Root = () => {

    return (
        <div>
            <Link to={'Home'}>Home</Link>
            <Link to={'HomeTest1'}>HomeTest1</Link>
            <Link to={'HomeTest2'}>HomeTest2</Link>
            <Outlet />
        </div>
    );
};

export default Root;
