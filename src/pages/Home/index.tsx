
import { useBaseData } from '@/store';
import { getDevice } from '@/utils';
import HomeTest1 from '../HomeTest1';
import { useMemo, useState } from 'react';
import svg from '@/assets/react.svg';

const Home = () => {

    const { test, updateTest, } = useBaseData((state) => state);
    const [count, setCount,] = useState(0);
    const [, update,] = useState({});

    return (
        <div className="color-main!">
            <div onClick={() => {
                setCount(count + 1);
                // update({});
                // updateTest();
            }}>Home 页面 {2}-{Math.random()}</div>
            <div style={{ }}>测试</div>
            <div className="flex">
                <div style={{ background: '#000', flexBasis: '3rem', }}>1</div>
                <div style={{ background: 'gray', flex: 'auto', width: 0, }}>1</div>
            </div>

            <div style={{ border: '0.5px solid #000', marginTop: 60, }}></div>
            <img className="un-w500px" src={svg} />

            <div>testVal: {test}</div>
            <div>innerWidth: {window.innerWidth}</div>
            <div>devicePixelRatio: {window.devicePixelRatio}</div>
            <div>getDevice: {getDevice().join()}</div>
            {/* {useMemo(() => <HomeTest1 />, [])} */}
        </div>
    );
};

export default Home;