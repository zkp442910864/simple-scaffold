
import { useBaseData } from '@/store';
import { getDevice } from '@/utils';
import { useRef, useState } from 'react';
import svg from '@/assets/react.svg';

const Home = () => {

    const { current: data, } = useRef({
        componentError: false,
    });
    const { test, updateTest, } = useBaseData((state) => state);
    const [count, setCount,] = useState(0);
    const [, update,] = useState({});

    if (data.componentError) {
        throw new Error('组件渲染报错');
    }

    return (
        <div className="color-main!">
            <div onClick={() => {
                setCount(count + 1);
                // update({});
                // updateTest();
            }}>Home 页面 点我{count}-{Math.random()}</div>
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
            <button onClick={() => {
                data.componentError = true;
                void update({});
            }}>组件渲染报错</button>
        </div>
    );
};

export default Home;